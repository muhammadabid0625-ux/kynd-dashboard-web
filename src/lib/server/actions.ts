"use server";

import { revalidatePath } from "next/cache";

import { requireDashboardRole } from "@/lib/server/auth";
import { supabaseRest } from "@/lib/server/supabase";

export async function saveReferralSettings(formData: FormData) {
  await requireDashboardRole("admin");

  const payload = {
    id: "default",
    enabled: formData.get("enabled") === "on",
    play_store_url: String(formData.get("playStoreUrl") ?? ""),
    app_store_url: String(formData.get("appStoreUrl") ?? ""),
    fallback_landing_url: String(formData.get("fallbackLandingUrl") ?? ""),
    referral_base_route: String(formData.get("referralBaseRoute") ?? "/r"),
    commission_type: String(formData.get("commissionType") ?? "fixed"),
    commission_value: Number(formData.get("commissionValue") ?? 0),
    app_launch_state: String(formData.get("appLaunchState") ?? "prelaunch"),
    notification_enabled: formData.get("notificationEnabled") === "on",
    default_timezone: String(formData.get("defaultTimezone") ?? "UTC"),
  };

  await supabaseRest("referral_settings", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(payload),
  });

  revalidatePath("/admin/settings");
  revalidatePath("/admin/referrals");
}

export async function saveNotificationTemplate(formData: FormData) {
  await requireDashboardRole("admin");

  const payload = {
    id: String(formData.get("id") ?? "manual-template"),
    key: String(formData.get("key") ?? "manual"),
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    emphasis_text: String(formData.get("emphasisText") ?? ""),
    audience: String(formData.get("audience") ?? "all_users"),
    send_hour_local: Number(formData.get("sendHourLocal") ?? 9),
    enabled: formData.get("enabled") === "on",
  };

  await supabaseRest("notification_templates", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(payload),
  });

  revalidatePath("/admin/notifications");
}

export async function createManualNotificationLog(formData: FormData) {
  await requireDashboardRole("admin");

  const now = new Date().toISOString();
  const payload = {
    template_key: "manual_test",
    user_id: String(formData.get("userId") ?? "") || null,
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    emphasis_text: String(formData.get("emphasisText") ?? ""),
    status: "queued",
    timezone: String(formData.get("timezone") ?? "UTC"),
    scheduled_for: now,
    sent_at: null,
  };

  await supabaseRest("notification_logs", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(payload),
  });

  revalidatePath("/admin/notifications");
}

export async function updatePayoutStatus(formData: FormData) {
  await requireDashboardRole("admin");

  const payoutId = String(formData.get("payoutId") ?? "");
  const status = String(formData.get("status") ?? "pending");
  const note = String(formData.get("note") ?? "");
  const paidAt = status === "paid" ? new Date().toISOString() : null;

  await supabaseRest(`affiliate_payouts?id=eq.${payoutId}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ status, note, paid_at: paidAt }),
  });

  revalidatePath("/admin/payouts");
  revalidatePath("/affiliate/payouts");
}

export async function saveAffiliateSettings(formData: FormData) {
  const session = await requireDashboardRole("affiliate");
  const payload = {
    payout_method: String(formData.get("payoutMethod") ?? "bank_transfer"),
    payout_details: String(formData.get("payoutDetails") ?? ""),
  };

  await supabaseRest(`affiliate_profiles?user_id=eq.${session.userId}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(payload),
  });

  revalidatePath("/affiliate/settings");
}
