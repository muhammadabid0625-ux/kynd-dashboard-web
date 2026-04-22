import { NextResponse } from "next/server";

import { supabaseRest } from "@/lib/server/supabase";

type AffiliateRow = {
  user_id: string;
  referral_code: string;
  status: string;
};

type SettingsRow = {
  enabled: boolean;
  play_store_url: string | null;
  app_store_url: string | null;
  fallback_landing_url: string | null;
  app_launch_state: "prelaunch" | "live";
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const url = new URL(request.url);
  const platform = url.searchParams.get("platform") ?? "web";

  const [affiliate] = await supabaseRest<AffiliateRow[]>(
    `affiliate_profiles?select=user_id,referral_code,status&referral_code=eq.${code}&status=eq.active&limit=1`,
  );
  const [settings] = await supabaseRest<SettingsRow[]>(
    "referral_settings?select=enabled,play_store_url,app_store_url,fallback_landing_url,app_launch_state&limit=1",
  );

  const fallback = settings?.fallback_landing_url || "https://example.com";

  if (!affiliate || settings?.enabled === false) {
    return NextResponse.redirect(fallback);
  }

  let destination = fallback;
  if (settings?.app_launch_state === "live") {
    if (platform === "ios" && settings?.app_store_url) {
      destination = settings.app_store_url;
    } else if (settings?.play_store_url) {
      destination = settings.play_store_url;
    }
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const country = request.headers.get("x-vercel-ip-country") ?? "Unknown";
  const userAgent = request.headers.get("user-agent") ?? "";

  await supabaseRest("referral_clicks", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      affiliate_user_id: affiliate.user_id,
      referral_code: affiliate.referral_code,
      destination_url: destination,
      platform,
      country,
      source_url: url.toString(),
      ip_address: forwardedFor,
      user_agent: userAgent,
      clicked_at: new Date().toISOString(),
    }),
  });

  return NextResponse.redirect(destination);
}
