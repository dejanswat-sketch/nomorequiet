import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { storyId } = await req.json();
    if (!storyId) {
      return NextResponse.json({ error: 'storyId required' }, { status: 400 });
    }

    // Get the story + user info
    const { data: story, error: storyError } = await supabase
      .from('soul_stories')
      .select('id, user_id, title')
      .eq('id', storyId)
      .single();

    if (storyError || !story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const now = new Date();
    const goldExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // 1. Mark story as winner + set pinned_at
    const { error: updateStoryError } = await supabase
      .from('soul_stories')
      .update({
        is_winner: true,
        is_nominated: true,
        pinned_at: now.toISOString(),
        anointed_at: now.toISOString(),
      })
      .eq('id', storyId);

    if (updateStoryError) {
      return NextResponse.json({ error: 'Failed to anoint story' }, { status: 500 });
    }

    // 2. Set gold_expires_at on user's light(s)
    await supabase
      .from('lights')
      .update({ gold_expires_at: goldExpiresAt })
      .eq('user_id', story.user_id);

    // 2b. Create win notification for user (seen on next login)
    await supabase
      .from('win_notifications')
      .insert({
        user_id: story.user_id,
        story_id: story.id,
        story_title: story.title,
        seen: false,
      });

    // 3. Get user email for notification
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('email, nickname')
      .eq('id', story.user_id)
      .single();

    // 4. Send email via Resend
    if (userProfile?.email && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key-here') {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'NoMoreQuiet <noreply@nomorequiet.com>',
            to: [userProfile.email],
            subject: 'Tvoja tišina je postala svetlost.',
            html: `
              <div style="background:#0a0806;color:#e8e0d0;font-family:Georgia,'Times New Roman',serif;padding:48px 32px;max-width:600px;margin:0 auto;">
                <div style="text-align:center;margin-bottom:32px;">
                  <div style="width:48px;height:48px;border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,0.6) 0%,rgba(212,175,55,0.1) 70%);margin:0 auto 16px;box-shadow:0 0 20px rgba(212,175,55,0.5);"></div>
                  <p style="font-size:10px;letter-spacing:0.3em;color:#D4AF37;font-family:Arial,sans-serif;margin:0;">NOMOREQUIET · RTANJ</p>
                </div>
                <h1 style="font-size:28px;font-weight:300;font-style:italic;color:#D4AF37;text-align:center;margin-bottom:24px;">
                  Tvoja tišina je postala svetlost.
                </h1>
                <p style="font-size:16px;line-height:1.8;color:#c8b89a;margin-bottom:20px;">
                  ${userProfile.nickname ? userProfile.nickname + ',' : 'Dragi glasniče,'}
                </p>
                <p style="font-size:16px;line-height:1.8;color:#c8b89a;margin-bottom:20px;">
                  Tvoja priča <em>"${story.title}"</em> je odabrana da bude deo Knjige Glasova — arhive planine.
                </p>
                <p style="font-size:16px;line-height:1.8;color:#c8b89a;margin-bottom:20px;">
                  Tvoja zvezda na mapi svetli zlatom narednih 7 dana.
                </p>
                <p style="font-size:16px;line-height:1.8;color:#c8b89a;margin-bottom:32px;">
                  Planina te je čula.
                </p>
                <div style="text-align:center;border-top:1px solid rgba(200,130,42,0.2);padding-top:24px;">
                  <p style="font-size:10px;letter-spacing:0.2em;color:#5a4e40;font-family:Arial,sans-serif;">
                    NOMOREQUIET · 43°46′N · 21°50′E
                  </p>
                </div>
              </div>
            `,
          }),
        });
      } catch {
        // Email failure is non-fatal
      }
    }

    return NextResponse.json({ success: true, goldExpiresAt });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
