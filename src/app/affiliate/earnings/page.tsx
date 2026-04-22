import { AffiliateFrame } from "@/components/dashboard/AffiliateFrame";
import { DataTable } from "@/components/dashboard/DataTable";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { requireDashboardRole } from "@/lib/server/auth";
import { getAffiliateDashboardData } from "@/lib/server/dashboard-data";
import { formatMoney } from "@/lib/server/format";

export default async function AffiliateEarningsPage() {
  const session = await requireDashboardRole("affiliate");
  const data = await getAffiliateDashboardData(session.userId);

  return (
    <AffiliateFrame
      session={session}
      heading="Earnings"
      description="Monthly earnings and conversion value attributed to your referral code."
      activePath="/affiliate/earnings"
    >
      <SectionCard title="Monthly earnings">
        <DataTable
          headers={["Month", "Net earnings"]}
          rows={(data?.earnings ?? []).map((row) => [row.label, formatMoney(row.amount)])}
        />
      </SectionCard>
    </AffiliateFrame>
  );
}
