import { AffiliateFrame } from "@/components/dashboard/AffiliateFrame";
import { DataTable } from "@/components/dashboard/DataTable";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { requireDashboardRole } from "@/lib/server/auth";
import { getAffiliateDashboardData } from "@/lib/server/dashboard-data";
import { formatDate, formatMoney } from "@/lib/server/format";

export default async function AffiliatePayoutsPage() {
  const session = await requireDashboardRole("affiliate");
  const data = await getAffiliateDashboardData(session.userId);

  return (
    <AffiliateFrame
      session={session}
      heading="Payouts"
      description="See pending, paid, and historical payout records assigned to your affiliate account."
      activePath="/affiliate/payouts"
    >
      <SectionCard title="Payout history">
        <DataTable
          headers={["Month", "Gross", "Net", "Status", "Paid at"]}
          rows={(data?.payouts ?? []).map((row) => [
            row.month,
            formatMoney(row.grossAmount),
            formatMoney(row.netAmount),
            row.status,
            formatDate(row.paidAt),
          ])}
        />
      </SectionCard>
    </AffiliateFrame>
  );
}
