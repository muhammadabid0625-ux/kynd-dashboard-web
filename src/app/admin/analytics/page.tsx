import { AdminFrame } from "@/components/dashboard/AdminFrame";
import { DataTable } from "@/components/dashboard/DataTable";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { requireDashboardRole } from "@/lib/server/auth";
import { getAnalyticsDataset } from "@/lib/server/dashboard-data";

export default async function AdminAnalyticsPage() {
  const session = await requireDashboardRole("admin");
  const data = await getAnalyticsDataset();

  return (
    <AdminFrame
      session={session}
      heading="Analytics"
      description="Daily, weekly, and monthly patterns across user activity, subscriptions, and referrals."
      activePath="/admin/analytics"
    >
      <div className="grid-two">
        <SectionCard title="Activity trend">
          <DataTable
            headers={["Date", "Active users", "Checkout events", "Sessions"]}
            rows={data.activity.map((row) => [row.label, row.activeUsers, row.checkouts, row.transactions])}
          />
        </SectionCard>

        <SectionCard title="Subscription trend">
          <DataTable
            headers={["Date", "Paid users", "Trial users"]}
            rows={data.subscriptions.map((row) => [row.label, row.paidUsers, row.trialUsers])}
          />
        </SectionCard>
      </div>

      <div className="grid-two">
        <SectionCard title="Referral conversion trend">
          <DataTable
            headers={["Date", "Clicks", "Conversions"]}
            rows={data.referralConversions.map((row) => [row.label, row.clicks, row.conversions])}
          />
        </SectionCard>

        <SectionCard title="Country split">
          <DataTable
            headers={["Country", "Users"]}
            rows={data.countryBreakdown.map((row) => [row.country, row.users])}
          />
        </SectionCard>
      </div>
    </AdminFrame>
  );
}
