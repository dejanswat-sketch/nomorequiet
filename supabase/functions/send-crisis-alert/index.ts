declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  // ✅ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  try {
    const { userEmail, userNickname, node, detectedLanguage, entryId, journalEntryCreatedAt } =
      await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "admin@nomorequiet.com";

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const nodeName = node
      ? node.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
      : "Unknown";

    const flaggedAt = journalEntryCreatedAt
      ? new Date(journalEntryCreatedAt).toUTCString()
      : new Date().toUTCString();

    // ── 1. Admin alert email ──────────────────────────────────────────────────
    const adminEmailPayload = {
      from: "onboarding@resend.dev",
      to: [ADMIN_EMAIL],
      subject: "⚠️ NMQ Crisis Flag — Immediate Review Required",
      html: `
        <div style="font-family: Georgia, serif; background: #0d0b08; color: #e8dcc8; padding: 32px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(200,130,42,0.3);">
          <p style="font-size: 11px; letter-spacing: 0.2em; color: #c8822a; text-transform: uppercase; margin-bottom: 8px;">NoMoreQuiet · Crisis Protocol</p>
          <h1 style="font-size: 24px; font-style: italic; color: #D4AF37; margin: 0 0 24px;">Crisis Flag Triggered</h1>

          <div style="background: rgba(255,107,43,0.08); border: 1px solid rgba(255,107,43,0.25); padding: 16px; margin-bottom: 24px;">
            <p style="font-size: 11px; letter-spacing: 0.15em; color: #ff6b2b; text-transform: uppercase; margin: 0 0 12px;">Flag Details</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #e8dcc8;">
              <tr><td style="padding: 4px 0; color: #8a7a6a; width: 140px;">User Email</td><td>${userEmail || "Anonymous"}</td></tr>
              <tr><td style="padding: 4px 0; color: #8a7a6a;">Nickname</td><td>${userNickname || "—"}</td></tr>
              <tr><td style="padding: 4px 0; color: #8a7a6a;">Node</td><td>${nodeName}</td></tr>
              <tr><td style="padding: 4px 0; color: #8a7a6a;">Language</td><td>${detectedLanguage || "Unknown"}</td></tr>
              <tr><td style="padding: 4px 0; color: #8a7a6a;">Entry ID</td><td style="font-size: 11px; color: #5a4e40;">${entryId || "—"}</td></tr>
              <tr><td style="padding: 4px 0; color: #8a7a6a;">Flagged At</td><td>${flaggedAt}</td></tr>
            </table>
          </div>

          <div style="background: rgba(200,130,42,0.05); border: 1px solid rgba(200,130,42,0.15); padding: 16px; margin-bottom: 24px;">
            <p style="font-size: 11px; letter-spacing: 0.15em; color: #c8822a; text-transform: uppercase; margin: 0 0 10px;">Automated Protocol Executed</p>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #c8b89a; line-height: 1.8;">
              <li>Mirroring response suppressed for this entry</li>
              <li>Warm holding message shown to user in their language</li>
              <li>Crisis resources displayed for their region</li>
              <li>Entry content not included here (privacy protected)</li>
            </ul>
          </div>

          <p style="font-size: 12px; color: #5a4e40; border-top: 1px solid rgba(200,130,42,0.1); padding-top: 16px; margin: 0;">
            Review this flag in the <strong style="color: #c8822a;">Admin Crisis Inbox</strong>. Entry content is never shown without user consent.
          </p>
        </div>
      `,
    };

    // ── 2. User warm holding email ────────────────────────────────────────────
    const userEmailPayload = userEmail
      ? {
          from: "onboarding@resend.dev",
          to: [userEmail],
          subject: "The House is holding this with you",
          html: `
            <div style="font-family: Georgia, serif; background: #0d0b08; color: #e8dcc8; padding: 40px 32px; max-width: 560px; margin: 0 auto; border: 1px solid rgba(200,130,42,0.2);">
              <p style="font-size: 11px; letter-spacing: 0.2em; color: #c8822a; text-transform: uppercase; margin-bottom: 8px;">NoMoreQuiet</p>
              <h1 style="font-size: 26px; font-style: italic; color: #D4AF37; margin: 0 0 28px; line-height: 1.3;">The House is holding this with you.</h1>

              <p style="font-size: 16px; font-style: italic; color: #c8b89a; line-height: 1.8; margin-bottom: 20px;">
                What you wrote today was received. All of it. The House does not look away.
              </p>

              <p style="font-size: 15px; color: #a89880; line-height: 1.8; margin-bottom: 20px;">
                You are not alone in this. If you are in a moment of crisis, please reach out to someone who can be present with you.
              </p>

              <div style="background: rgba(200,130,42,0.06); border-left: 2px solid #c8822a; padding: 16px 20px; margin-bottom: 28px;">
                <p style="font-size: 12px; letter-spacing: 0.12em; color: #c8822a; text-transform: uppercase; margin: 0 0 10px;">If you need immediate support</p>
                <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #c8b89a; line-height: 2;">
                  <li><strong style="color: #e8dcc8;">International Association for Suicide Prevention</strong> — <a href="https://www.iasp.info/resources/Crisis_Centres/" style="color: #D4AF37;">iasp.info/resources/Crisis_Centres</a></li>
                  <li><strong style="color: #e8dcc8;">Crisis Text Line (US/UK/CA/IE)</strong> — Text HOME to 741741</li>
                  <li><strong style="color: #e8dcc8;">Befrienders Worldwide</strong> — <a href="https://www.befrienders.org" style="color: #D4AF37;">befrienders.org</a></li>
                </ul>
              </div>

              <p style="font-size: 15px; font-style: italic; color: #a89880; line-height: 1.8; margin-bottom: 28px;">
                The stone holds what you brought here. You can return when you are ready. There is no rush. The House does not close.
              </p>

              <p style="font-size: 12px; color: #5a4e40; border-top: 1px solid rgba(200,130,42,0.1); padding-top: 16px; margin: 0;">
                This message was sent because something you wrote today was flagged by our care system. Your entry content is private and was not read by any person.
              </p>
            </div>
          `,
        }
      : null;

    // ── Send emails ───────────────────────────────────────────────────────────
    const sendEmail = async (payload: object) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Resend API error: ${err}`);
      }
      return res.json();
    };

    const results: { admin?: unknown; user?: unknown } = {};
    results.admin = await sendEmail(adminEmailPayload);

    if (userEmailPayload) {
      results.user = await sendEmail(userEmailPayload);
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
