import { NextRequest, NextResponse } from 'next/server';

// Admin notification for Deep Read purchases
// Called by Stripe webhook after successful Deep Read payment

export async function POST(req: NextRequest) {
  const webhookSecret = req.headers.get('x-webhook-secret');
  if (webhookSecret !== process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId, checkoutSession, journalEntries } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.error('ADMIN_EMAIL not configured');
      return NextResponse.json({ error: 'Admin email not configured' }, { status: 500 });
    }

    // Build journal summary for admin email
    const entrySummary = Array.isArray(journalEntries) && journalEntries.length > 0
      ? journalEntries
          .slice(0, 10)
          .map((e: { content: string; created_at: string; depth_score?: number }, i: number) =>
            `--- Entry ${i + 1} (${new Date(e.created_at).toLocaleDateString()}) ---\n${e.content?.substring(0, 800)}${(e.content?.length || 0) > 800 ? '...' : ''}`
          )
          .join('\n\n')
      : 'No journal entries found.';

    const emailBody = `
<h2>🔔 New Deep Read Request</h2>
<p><strong>User ID:</strong> ${userId}</p>
<p><strong>Stripe Session:</strong> ${checkoutSession}</p>
<p><strong>Received:</strong> ${new Date().toISOString()}</p>
<p><strong>Status:</strong> Pending — respond within 48–72 hours</p>

<hr />
<h3>User's Journal Entries (last 10)</h3>
<pre style="font-family: Georgia, serif; line-height: 1.6; white-space: pre-wrap;">${entrySummary}</pre>

<hr />
<p>Log in to the admin panel to update the status once your analysis is complete.</p>
    `.trim();

    // Send via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey || resendKey === 'your-resend-api-key-here') {
      console.warn('Resend API key not configured — skipping email notification');
      return NextResponse.json({ success: true, emailSent: false });
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NMQ System <noreply@nomorequiet.com>',
        to: [adminEmail],
        subject: `[Deep Read] New request from user ${userId.substring(0, 8)}`,
        html: emailBody,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error('Resend email failed:', errText);
    }

    return NextResponse.json({ success: true, emailSent: emailRes.ok });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Deep Read admin notification error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
