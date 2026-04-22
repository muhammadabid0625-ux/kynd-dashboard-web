import { AffiliateFrame } from "@/components/dashboard/AffiliateFrame";
import { DataTable } from "@/components/dashboard/DataTable";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { requireDashboardRole } from "@/lib/server/auth";
import { getAffiliateDashboardData } from "@/lib/server/dashboard-data";
import { formatDate, formatMoney } from "@/lib/server/format";

export default async function AffiliateOverviewPage() {
  const session = await requireDashboardRole("affiliate");
  const data = await getAffiliateDashboardData(session.userId);

  if (!data) {
    return (
      <AffiliateFrame
        session={session}
        heading="Affiliate overview"
        description="Your affiliate profile has not been provisioned yet."
        activePath="/affiliate"
      >
        <SectionCard title="No affiliate profile">
          <p className="note-text">Ask an administrator to create your affiliate profile and referral code.</p>
        </SectionCard>
      </AffiliateFrame>
    );
  }

  return (
    <AffiliateFrame
      session={session}
      heading="Affiliate overview"
      description="Track your clicks, conversions, earnings, and payout status in one simple workspace."
      activePath="/affiliate"
    >
      <div className="grid-cards">
        {data.summary.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid-two">
        <SectionCard title="Recent clicks">
          <DataTable
            headers={["Clicked", "Platform", "Destination"]}
            rows={data.recentClicks.map((item) => [formatDate(item.clickedAt), item.platform, item.destination])}
          />
        </SectionCard>

        <SectionCard title="Payout snapshot">
          <DataTable
            headers={["Month", "Net", "Status"]}
            rows={data.payouts.slice(0, 8).map((row) => [row.month, formatMoney(row.netAmount), row.status])}
          />
        </SectionCard>
      </div>
    </AffiliateFrame>
  );
}
