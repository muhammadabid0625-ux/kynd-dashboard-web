import { AdminFrame } from "@/components/dashboard/AdminFrame";
import { DataTable } from "@/components/dashboard/DataTable";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { requireDashboardRole } from "@/lib/server/auth";
import { getAdminOverviewData } from "@/lib/server/dashboard-data";

export default async function AdminOverviewPage() {
  const session = await requireDashboardRole("admin");
  const data = await getAdminOverviewData();

  return (
    <AdminFrame
      session={session}
      heading="Admin overview"
      description="Track users, referrals, payouts, and notification operations from one secure control surface."
      activePath="/admin"
    >
      <div className="grid-cards">
        {data.kpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid-two">
        <SectionCard title="Growth pulse" description="New users and conversions across the last 7 days.">
          <DataTable
            headers={["Date", "New users", "Conversions"]}
            rows={data.growth.map((row) => [row.label, row.users, row.conversions])}
          />
        </SectionCard>

        <SectionCard
          title="Notification summary"
          description="Quick delivery health from queued and delivered notification logs."
        >
          <div className="metric-strip">
            <div className="metric-pill">
              <span>Total logs</span>
              <strong>{data.notificationSummary.totalLogs}</strong>
            </div>
            <div className="metric-pill">
              <span>Delivered</span>
              <strong>{data.notificationSummary.delivered}</strong>
            </div>
            <div className="metric-pill">
              <span>Pending</span>
              <strong>{data.notificationSummary.pending}</strong>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Country distribution" description="Where your current users are located.">
        <DataTable
          headers={["Country", "Users"]}
          rows={data.countryBreakdown.map((row) => [row.country, row.users])}
        />
      </SectionCard>
    </AdminFrame>
  );
}
