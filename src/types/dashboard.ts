export type DashboardRole = "admin" | "affiliate";

export interface DashboardSession {
  userId: string;
  email: string;
  role: DashboardRole;
  displayName: string;
}

export interface KpiStat {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "warning";
}

export interface AdminOverviewData {
  kpis: KpiStat[];
  growth: Array<{ label: string; users: number; conversions: number }>;
  countryBreakdown: Array<{ country: string; users: number }>;
  notificationSummary: {
    totalLogs: number;
    delivered: number;
    pending: number;
  };
}

export interface AdminUserSummary {
  userId: string;
  name: string;
  email: string;
  country: string;
  timezone: string;
  subscriptionStatus: string;
  lastActive: string;
  usageFrequency: string;
  goalCount: number;
  transactionCount: number;
  savingsActivityCount: number;
  referralSource: string;
}

export interface AdminUserDetail extends AdminUserSummary {
  checkInCount: number;
  checkOutCount: number;
  totalSaved: number;
  currentGoals: Array<{ name: string; targetAmount: number; currentSaved: number }>;
  recentTransactions: Array<{ id: string; type: string; amount: number; category: string; date: string; note?: string }>;
}

export interface AnalyticsDataset {
  activity: Array<{ label: string; activeUsers: number; checkouts: number; transactions: number }>;
  subscriptions: Array<{ label: string; paidUsers: number; trialUsers: number }>;
  referralConversions: Array<{ label: string; clicks: number; conversions: number }>;
  countryBreakdown: Array<{ country: string; users: number }>;
}

export interface NotificationTemplateRecord {
  id: string;
  key: string;
  title: string;
  body: string;
  emphasisText: string;
  audience: string;
  sendHourLocal: number;
  enabled: boolean;
}

export interface NotificationLogRecord {
  id: string;
  userId: string | null;
  templateKey: string;
  title: string;
  body: string;
  emphasisText: string;
  status: string;
  timezone: string;
  scheduledFor: string | null;
  sentAt: string | null;
}

export interface NotificationCenterData {
  templates: NotificationTemplateRecord[];
  logs: NotificationLogRecord[];
  pushTokenCount: number;
}

export interface ReferralSettingsRecord {
  enabled: boolean;
  playStoreUrl: string;
  appStoreUrl: string;
  fallbackLandingUrl: string;
  referralBaseRoute: string;
  commissionType: "fixed" | "percent";
  commissionValue: number;
  appLaunchState: "prelaunch" | "live";
  defaultTimezone: string;
}

export interface AffiliateReferralSummary {
  affiliateUserId: string;
  affiliateName: string;
  email: string;
  referralCode: string;
  clicks: number;
  signups: number;
  conversions: number;
  subscribers: number;
  totalEarnings: number;
  pendingPayout: number;
  paidAmount: number;
}

export interface ReferralAdminData {
  settings: ReferralSettingsRecord;
  affiliates: AffiliateReferralSummary[];
  clicks: Array<{ id: string; code: string; clickedAt: string; destination: string; platform: string; country: string }>;
  conversions: Array<{ id: string; code: string; convertedAt: string; subscriptionPlan: string; amount: number; status: string }>;
}

export interface PayoutRecord {
  id: string;
  affiliateUserId: string;
  affiliateName: string;
  month: string;
  grossAmount: number;
  netAmount: number;
  status: "pending" | "paid" | "cancelled";
  paidAt: string | null;
  note: string;
}

export interface PayoutAdminData {
  pendingTotal: number;
  paidTotal: number;
  rows: PayoutRecord[];
}

export interface AffiliateDashboardData {
  summary: KpiStat[];
  referralLink: string;
  recentClicks: Array<{ id: string; clickedAt: string; platform: string; destination: string }>;
  earnings: Array<{ label: string; amount: number }>;
  payouts: PayoutRecord[];
  profile: {
    displayName: string;
    email: string;
    referralCode: string;
    payoutMethod: string;
    payoutDetails: string;
    status: string;
  };
}
