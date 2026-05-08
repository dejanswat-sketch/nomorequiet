import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Deep Insight — Jungian AI Soul Analysis
// Called by Stripe webhook after successful payment
// Also callable directly by authenticated user to regenerate

const JUNGIAN_PROMPT = `You are a depth psychologist trained in Jungian analysis. You have been given a person's journal entries. Your task is to write a Soul Analysis Report of 600–800 words.

STRUCTURE OF THE REPORT:
1. **Dominant Archetype** — Identify the primary Jungian archetype present in the writing (Hero, Shadow, Anima/Animus, Self, Trickster, Wise Old Man/Woman, etc.). Explain why.
2. **Shadow Identification** — What is being avoided, projected, or suppressed? Name the Shadow topic directly and with care.
3. **Core Tension** — What is the central psychological conflict visible in the entries?
4. **The Unlived Life** — What potential or path is being circled but not yet entered?
5. **A Question to Carry** — End with one precise, non-therapeutic question that opens rather than closes.

TONE RULES:
- Literary, unhurried, precise. No clinical language.
- Use the person's own words and images where possible.
- Do not diagnose. Do not advise. Do not fix.
- Write as if you are speaking to someone who can hold complexity.
- Minimum 600 words, maximum 800 words.

LANGUAGE RULE: Detect the dominant language of the journal entries and write the entire report in that language.`;

export async function POST(req: NextRequest) {
  // Verify caller — either webhook (with secret) or authenticated user
  const webhookSecret = req.headers.get('x-webhook-secret');
  const isWebhookCall = webhookSecret === process.env.STRIPE_WEBHOOK_SECRET;

  let userId: string;

  if (isWebhookCall) {
    const body = await req.json();
    userId = body.userId;
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }
  } else {
    // Authenticated user call
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    userId = user.id;
  }

  try {
    // Use service role to bypass RLS
    const { createClient: createServiceClient } = await import('@supabase/supabase-js');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey || serviceRoleKey === 'your-supabase-service-role-key-here') {
      return NextResponse.json({ error: 'Server configuration error: missing service role key' }, { status: 500 });
    }
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );

    // Check user has paid for deep_insight
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('product', 'deep_insight')
      .eq('stripe_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!purchase) {
      return NextResponse.json({ error: 'No Deep Insight purchase found' }, { status: 403 });
    }

    // Fetch user's journal entries
    const { data: entries } = await supabase
      .from('journal_entries')
      .select('content, created_at, depth_score, emotion_tags, shadow_topics, archetype_hint')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(15);

    if (!entries || entries.length === 0) {
      return NextResponse.json({ error: 'No journal entries found for analysis' }, { status: 400 });
    }

    // Build journal context
    const journalContext = entries
      .map((e: { content: string; created_at: string; depth_score: number; emotion_tags: string[]; shadow_topics: string[]; archetype_hint: string | null }, i: number) =>
        `Entry ${i + 1} (${new Date(e.created_at).toLocaleDateString()}):\n${e.content}`
      )
      .join('\n\n---\n\n');

    const fullPrompt = `${JUNGIAN_PROMPT}\n\n=== JOURNAL ENTRIES ===\n\n${journalContext}`;

    // Call Gemini via internal API route
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nomorequie6253.builtwithrocket.new';
    const aiResponse = await fetch(`${siteUrl}/api/ai/chat-completion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'GEMINI',
        model: 'gemini/gemini-2.5-flash',
        messages: [{ role: 'user', content: fullPrompt }],
        max_tokens: 1200,
        temperature: 0.75,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('AI generation failed');
    }

    const aiData = await aiResponse.json();
    const report = aiData.content || aiData.message || '';

    // Store report in purchases table metadata
    await supabase
      .from('purchases')
      .update({ stripe_status: 'delivered', fragment: report.substring(0, 500) })
      .eq('id', purchase.id);

    // Store full report in journal_entries as a special entry
    await supabase.from('journal_entries').insert({
      user_id: userId,
      content: report,
      word_count: report.split(/\s+/).length,
      node: 'rtanj',
      depth_score: 10,
      mirroring_response: 'DEEP_INSIGHT_REPORT',
      archetype_hint: 'soul_analysis',
    });

    return NextResponse.json({ report, success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Deep Insight generation error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
