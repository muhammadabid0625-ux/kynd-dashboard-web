import type {
  AdminOverviewData,
  AdminUserDetail,
  AdminUserSummary,
  AffiliateDashboardData,
  AnalyticsDataset,
  NotificationCenterData,
  NotificationLogRecord,
  NotificationTemplateRecord,
  PayoutAdminData,
  PayoutRecord,
  ReferralAdminData,
  ReferralSettingsRecord,
} from "@/types/dashboard";
import { lastNDaysLabels } from "@/lib/server/format";
import { supabaseRest } from "@/lib/server/supabase";

type FinanceProfileRow = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  country_label: string | null;
  timezone: string | null;
  monthly_income: number | null;
  has_completed_profile_setup: boolean | null;
  has_completed_income_setup: boolean | null;
  has_completed_goal_setup: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

type SubscriptionRow = {
  user_id: string;
  selected_plan: string;
  activated_at: string | null;
};

type GoalRow = {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_saved: number;
};

type TransactionRow = {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  category: string;
  date: string;
  note: string | null;
};

type CheckInRow = {
  id: string;
  user_id: string;
  created_at: string | null;
};

type CheckOutRow = {
  id: string;
  user_id: string;
  available_saving: number | null;
  created_at: string | null;
  date: string;
};

type AllocationRow = {
  id: string;
  user_id: string;
  amount: number;
};

type ActivityRow = {
  id: string;
  user_id: string;
  activity_date: string;
  session_count: number;
  last_active_at: string | null;
};

type AffiliateRow = {
  user_id: string;
  referral_code: string;
  status: string;
  payout_method: string | null;
  payout_details: string | null;
};

type ReferralClickRow = {
  id: string;
  affiliate_user_id: string;
  referral_code: string;
  destination_url: string;
  platform: string;
  country: string | null;
  clicked_at: string;
};

type ReferralConversionRow = {
  id: string;
  affiliate_user_id: string;
  referral_code: string;
  referred_user_id: string | null;
  subscription_plan: string | null;
  conversion_amount: number | null;
  status: string;
  converted_at: string;
};

type EarningsRow = {
  id: string;
  affiliate_user_id: string;
  year_month: string;
  gross_amount: number;
  net_amount: number;
  status: string;
};

type SettingsRow = {
  id: string;
  enabled: boolean;
  play_store_url: string | null;
  app_store_url: string | null;
  fallback_landing_url: string | null;
  referral_base_route: string | null;
  commission_type: "fixed" | "percent";
  commission_value: number;
  app_launch_state: "prelaunch" | "live";
  notification_enabled: boolean;
  default_timezone: string | null;
};

type PayoutRow = {
  id: string;
  affiliate_user_id: string;
  affiliate_name: string;
  month: string;
  gross_amount: number;
  net_amount: number;
  status: "pending" | "paid" | "cancelled";
  paid_at: string | null;
  note: string;
};

type PushTokenRow = {
  id: string;
  user_id: string;
};

type UserRoleRow = {
  user_id: string;
  role: "admin" | "affiliate";
  display_name: string | null;
  status: string;
};

type NotificationTemplateRow = {
  id: string;
  key: string;
  title: string;
  body: string;
  emphasis_text: string | null;
  audience: string;
  send_hour_local: number;
  enabled: boolean;
};

type NotificationLogRow = {
  id: string;
  user_id: string | null;
  template_key: string;
  title: string;
  body: string;
  emphasis_text: string | null;
  status: string;
  timezone: string | null;
  scheduled_for: string | null;
  sent_at: string | null;
};

async function getCoreData() {
  const [
    profiles,
    subscriptions,
    goals,
    transactions,
    checkins,
    checkouts,
    allocations,
    activity,
    affiliates,
    settingsRows,
    clicks,
    conversions,
    earnings,
    payouts,
    pushTokens,
    templates,
    logs,
    roles,
  ] = await Promise.all([
    supabaseRest<FinanceProfileRow[]>(
      "finance_profiles?select=user_id,full_name,email,country_label,timezone,monthly_income,has_completed_profile_setup,has_completed_income_setup,has_completed_goal_setup,created_at,updated_at&order=created_at.desc",
    ),
    supabaseRest<SubscriptionRow[]>(
      "finance_subscriptions?select=user_id,selected_plan,activated_at",
    ),
    supabaseRest<GoalRow[]>("finance_goals?select=id,user_id,name,target_amount,current_saved"),
    supabaseRest<TransactionRow[]>(
      "finance_transactions?select=id,user_id,type,amount,category,date,note&order=date.desc",
    ),
    supabaseRest<CheckInRow[]>("finance_checkins?select=id,user_id,created_at"),
    supabaseRest<CheckOutRow[]>(
      "finance_checkouts?select=id,user_id,available_saving,created_at,date&order=date.desc",
    ),
    supabaseRest<AllocationRow[]>("finance_goal_allocations?select=id,user_id,amount"),
    supabaseRest<ActivityRow[]>(
      "user_activity_daily?select=id,user_id,activity_date,session_count,last_active_at&order=activity_date.desc",
    ),
    supabaseRest<AffiliateRow[]>(
      "affiliate_profiles?select=user_id,referral_code,status,payout_method,payout_details",
    ),
    supabaseRest<SettingsRow[]>(
      "referral_settings?select=id,enabled,play_store_url,app_store_url,fallback_landing_url,referral_base_route,commission_type,commission_value,app_launch_state,notification_enabled,default_timezone&limit=1",
    ),
    supabaseRest<ReferralClickRow[]>(
      "referral_clicks?select=id,affiliate_user_id,referral_code,destination_url,platform,country,clicked_at&order=clicked_at.desc&limit=250",
    ),
    supabaseRest<ReferralConversionRow[]>(
      "referral_conversions?select=id,affiliate_user_id,referral_code,referred_user_id,subscription_plan,conversion_amount,status,converted_at&order=converted_at.desc&limit=250",
    ),
    supabaseRest<EarningsRow[]>(
      "affiliate_earnings?select=id,affiliate_user_id,year_month,gross_amount,net_amount,status&order=year_month.desc",
    ),
    supabaseRest<PayoutRow[]>(
      "affiliate_payouts?select=id,affiliate_user_id,affiliate_name,month,gross_amount,net_amount,status,paid_at,note&order=month.desc",
    ),
    supabaseRest<PushTokenRow[]>("push_tokens?select=id,user_id"),
    supabaseRest<NotificationTemplateRow[]>(
      "notification_templates?select=id,key,title,body,emphasis_text,audience,send_hour_local,enabled&order=key.asc",
    ),
    supabaseRest<NotificationLogRow[]>(
      "notification_logs?select=id,user_id,template_key,title,body,emphasis_text,status,timezone,scheduled_for,sent_at&order=scheduled_for.desc&limit=200",
    ),
    supabaseRest<UserRoleRow[]>("dashboard_user_roles?select=user_id,role,display_name,status"),
  ]);

  return {
    profiles,
    subscriptions,
    goals,
    transactions,
    checkins,
    checkouts,
    allocations,
    activity,
    affiliates,
    settingsRows,
    clicks,
    conversions,
    earnings,
    payouts,
    pushTokens,
    templates,
    logs,
    roles,
  };
}

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  const { profiles, subscriptions, affiliates, clicks, conversions, payouts, logs, activity } =
    await getCoreData();
  const today = new Date().toISOString().slice(0, 10);
  const labels = lastNDaysLabels(7);

  const activeUsers = new Set(activity.filter((item) => item.session_count > 0).map((item) => item.user_id)).size;
  const paidUsers = new Set(subscriptions.filter((item) => item.activated_at).map((item) => item.user_id)).size;
  const newToday = profiles.filter((item) => item.created_at?.startsWith(today)).length;

  return {
    kpis: [
      { label: "Total users", value: String(profiles.length), hint: "All finance profiles" },
      { label: "Active users", value: String(activeUsers), hint: "Tracked from activity logs", tone: "success" },
      { label: "Paid users", value: String(paidUsers), hint: "Activated subscriptions" },
      { label: "New today", value: String(newToday), hint: "Profiles created today", tone: "warning" },
      { label: "Total affiliates", value: String(affiliates.length), hint: "Active referral partners" },
      { label: "Total clicks", value: String(clicks.length), hint: "Tracked referral hits" },
      { label: "Conversions", value: String(conversions.length), hint: "Referral conversions" },
      {
        label: "Pending payouts",
        value: String(payouts.filter((item) => item.status === "pending").length),
        hint: "Rows waiting for review",
      },
    ],
    growth: labels.map((label) => ({
      label,
      users: profiles.filter((item) => item.created_at?.startsWith(label)).length,
      conversions: conversions.filter((item) => item.converted_at.startsWith(label)).length,
    })),
    countryBreakdown: Array.from(
      profiles.reduce((map, row) => {
        const key = row.country_label || "Unknown";
        map.set(key, (map.get(key) ?? 0) + 1);
        return map;
      }, new Map<string, number>()),
    )
      .map(([country, users]) => ({ country, users }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 8),
    notificationSummary: {
      totalLogs: logs.length,
      delivered: logs.filter((item) => item.status === "delivered").length,
      pending: logs.filter((item) => item.status === "queued" || item.status === "scheduled").length,
    },
  };
}

export async function getAdminUsers(): Promise<AdminUserSummary[]> {
  const { profiles, subscriptions, goals, transactions, allocations, activity, conversions } =
    await getCoreData();

  return profiles.map((profile) => {
    const userId = profile.user_id;
    const subscription = subscriptions.find((item) => item.user_id === userId);
    const userActivity = activity.filter((item) => item.user_id === userId);
    const referral = conversions.find((item) => item.referred_user_id === userId);

    return {
      userId,
      name: profile.full_name || profile.email || "Unnamed user",
      email: profile.email || "No email",
      country: profile.country_label || "Unknown",
      timezone: profile.timezone || "Unknown",
      subscriptionStatus: subscription?.selected_plan || "free",
      lastActive: userActivity[0]?.last_active_at || profile.updated_at || profile.created_at || "",
      usageFrequency: `${userActivity.reduce((sum, item) => sum + item.session_count, 0)} sessions logged`,
      goalCount: goals.filter((item) => item.user_id === userId).length,
      transactionCount: transactions.filter((item) => item.user_id === userId).length,
      savingsActivityCount: allocations.filter((item) => item.user_id === userId).length,
      referralSource: referral?.referral_code || "Direct",
    };
  });
}

export async function getAdminUserDetail(userId: string): Promise<AdminUserDetail | null> {
  const { goals, transactions, checkins, checkouts, allocations } = await getCoreData();
  const summary = (await getAdminUsers()).find((item) => item.userId === userId);

  if (!summary) {
    return null;
  }

  const currentGoals = goals
    .filter((item) => item.user_id === userId)
    .map((goal) => ({ name: goal.name, targetAmount: goal.target_amount, currentSaved: goal.current_saved }));

  const recentTransactions = transactions
    .filter((item) => item.user_id === userId)
    .slice(0, 10)
    .map((row) => ({ id: row.id, type: row.type, amount: row.amount, category: row.category, date: row.date, note: row.note || undefined }));

  return {
    ...summary,
    checkInCount: checkins.filter((item) => item.user_id === userId).length,
    checkOutCount: checkouts.filter((item) => item.user_id === userId).length,
    totalSaved: allocations.filter((item) => item.user_id === userId).reduce((sum, item) => sum + item.amount, 0),
    currentGoals,
    recentTransactions,
  };
}

export async function getAnalyticsDataset(): Promise<AnalyticsDataset> {
  const { activity, subscriptions, conversions, profiles, clicks } = await getCoreData();
  const labels = lastNDaysLabels(14);

  return {
    activity: labels.map((label) => {
      const dayRows = activity.filter((item) => item.activity_date === label);
      return {
        label,
        activeUsers: new Set(dayRows.map((item) => item.user_id)).size,
        checkouts: dayRows.length,
        transactions: dayRows.reduce((sum, item) => sum + item.session_count, 0),
      };
    }),
    subscriptions: labels.map((label) => ({
      label,
      paidUsers: subscriptions.filter((item) => item.activated_at?.startsWith(label)).length,
      trialUsers: profiles.filter((item) => item.created_at?.startsWith(label)).length,
    })),
    referralConversions: labels.map((label) => ({
      label,
      clicks: clicks.filter((item) => item.clicked_at.startsWith(label)).length,
      conversions: conversions.filter((item) => item.converted_at.startsWith(label)).length,
    })),
    countryBreakdown: Array.from(
      profiles.reduce((map, row) => {
        const key = row.country_label || "Unknown";
        map.set(key, (map.get(key) ?? 0) + 1);
        return map;
      }, new Map<string, number>()),
    ).map(([country, users]) => ({ country, users })),
  };
}

export async function getNotificationCenterData(): Promise<NotificationCenterData> {
  const { templates, logs, pushTokens } = await getCoreData();
  return {
    templates: templates.map((item): NotificationTemplateRecord => ({
      id: item.id,
      key: item.key,
      title: item.title,
      body: item.body,
      emphasisText: item.emphasis_text || "",
      audience: item.audience,
      sendHourLocal: item.send_hour_local,
      enabled: item.enabled,
    })),
    logs: logs.map((item): NotificationLogRecord => ({
      id: item.id,
      userId: item.user_id,
      templateKey: item.template_key,
      title: item.title,
      body: item.body,
      emphasisText: item.emphasis_text || "",
      status: item.status,
      timezone: item.timezone || "UTC",
      scheduledFor: item.scheduled_for,
      sentAt: item.sent_at,
    })),
    pushTokenCount: pushTokens.length,
  };
}

export async function getReferralAdminData(): Promise<ReferralAdminData> {
  const { settingsRows, affiliates, clicks, conversions, earnings, profiles } = await getCoreData();
  const settings = settingsRows[0];
  const affiliateDetails = affiliates.map((affiliate) => {
    const profile = profiles.find((item) => item.user_id === affiliate.user_id);
    const affiliateClicks = clicks.filter((item) => item.affiliate_user_id === affiliate.user_id);
    const affiliateConversions = conversions.filter((item) => item.affiliate_user_id === affiliate.user_id);
    const affiliateEarnings = earnings.filter((item) => item.affiliate_user_id === affiliate.user_id);

    return {
      affiliateUserId: affiliate.user_id,
      affiliateName: profile?.full_name || profile?.email || affiliate.referral_code,
      email: profile?.email || "No email",
      referralCode: affiliate.referral_code,
      clicks: affiliateClicks.length,
      signups: affiliateConversions.filter((item) => item.referred_user_id).length,
      conversions: affiliateConversions.length,
      subscribers: affiliateConversions.filter((item) => item.status === "paid").length,
      totalEarnings: affiliateEarnings.reduce((sum, item) => sum + item.net_amount, 0),
      pendingPayout: affiliateEarnings
        .filter((item) => item.status === "pending")
        .reduce((sum, item) => sum + item.net_amount, 0),
      paidAmount: affiliateEarnings
        .filter((item) => item.status === "paid")
        .reduce((sum, item) => sum + item.net_amount, 0),
    };
  });

  const safeSettings: ReferralSettingsRecord = {
    enabled: settings?.enabled ?? true,
    playStoreUrl: settings?.play_store_url ?? "",
    appStoreUrl: settings?.app_store_url ?? "",
    fallbackLandingUrl: settings?.fallback_landing_url ?? "",
    referralBaseRoute: settings?.referral_base_route ?? "/r",
    commissionType: settings?.commission_type ?? "fixed",
    commissionValue: settings?.commission_value ?? 5,
    appLaunchState: settings?.app_launch_state ?? "prelaunch",
    defaultTimezone: settings?.default_timezone ?? "UTC",
  };

  return {
    settings: safeSettings,
    affiliates: affiliateDetails,
    clicks: clicks.map((item) => ({
      id: item.id,
      code: item.referral_code,
      clickedAt: item.clicked_at,
      destination: item.destination_url,
      platform: item.platform,
      country: item.country || "Unknown",
    })),
    conversions: conversions.map((item) => ({
      id: item.id,
      code: item.referral_code,
      convertedAt: item.converted_at,
      subscriptionPlan: item.subscription_plan || "free",
      amount: item.conversion_amount ?? 0,
      status: item.status,
    })),
  };
}

export async function getPayoutAdminData(): Promise<PayoutAdminData> {
  const { payouts } = await getCoreData();
  const rows: PayoutRecord[] = payouts.map((item) => ({
    id: item.id,
    affiliateUserId: item.affiliate_user_id,
    affiliateName: item.affiliate_name,
    month: item.month,
    grossAmount: item.gross_amount,
    netAmount: item.net_amount,
    status: item.status,
    paidAt: item.paid_at,
    note: item.note,
  }));

  return {
    pendingTotal: rows.filter((item) => item.status === "pending").reduce((sum, item) => sum + item.netAmount, 0),
    paidTotal: rows.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.netAmount, 0),
    rows,
  };
}

export async function getAffiliateDashboardData(userId: string): Promise<AffiliateDashboardData | null> {
  const { affiliates, profiles, clicks, conversions, earnings, payouts } = await getCoreData();
  const affiliate = affiliates.find((item) => item.user_id === userId);
  const profile = profiles.find((item) => item.user_id === userId);

  if (!affiliate) {
    return null;
  }

  const affiliateClicks = clicks.filter((item) => item.affiliate_user_id === userId);
  const affiliateConversions = conversions.filter((item) => item.affiliate_user_id === userId);
  const affiliateEarnings = earnings.filter((item) => item.affiliate_user_id === userId);
  const affiliatePayouts: PayoutRecord[] = payouts
    .filter((item) => item.affiliate_user_id === userId)
    .map((item) => ({
      id: item.id,
      affiliateUserId: item.affiliate_user_id,
      affiliateName: item.affiliate_name,
      month: item.month,
      grossAmount: item.gross_amount,
      netAmount: item.net_amount,
      status: item.status,
      paidAt: item.paid_at,
      note: item.note,
    }));

  return {
    summary: [
      { label: "Total clicks", value: String(affiliateClicks.length) },
      { label: "Signups", value: String(affiliateConversions.filter((item) => item.referred_user_id).length) },
      { label: "Conversions", value: String(affiliateConversions.length), tone: "success" },
      {
        label: "Pending payout",
        value: String(affiliateEarnings.filter((item) => item.status === "pending").reduce((sum, item) => sum + item.net_amount, 0)),
        hint: "Awaiting admin review",
      },
    ],
    referralLink: `/r/${affiliate.referral_code}`,
    recentClicks: affiliateClicks.slice(0, 8).map((item) => ({
      id: item.id,
      clickedAt: item.clicked_at,
      platform: item.platform,
      destination: item.destination_url,
    })),
    earnings: affiliateEarnings.map((item) => ({ label: item.year_month, amount: item.net_amount })),
    payouts: affiliatePayouts,
    profile: {
      displayName: profile?.full_name || profile?.email || affiliate.referral_code,
      email: profile?.email || "",
      referralCode: affiliate.referral_code,
      payoutMethod: affiliate.payout_method || "Not set",
      payoutDetails: affiliate.payout_details || "Add payout info later",
      status: affiliate.status,
    },
  };
}
