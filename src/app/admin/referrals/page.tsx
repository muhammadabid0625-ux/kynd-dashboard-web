import { AdminFrame } from "@/components/dashboard/AdminFrame";
import { DataTable } from "@/components/dashboard/DataTable";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { requireDashboardRole } from "@/lib/server/auth";
import { getReferralAdminData } from "@/lib/server/dashboard-data";
import { formatDate, formatMoney } from "@/lib/server/format";

export default async function AdminReferralsPage() {
  const session = await requireDashboardRole("admin");
  const data = await getReferralAdminData();

  return (
    <AdminFrame
      session={session}
      heading="Referrals & affiliates"
      description="Monitor performance, conversion quality, and destination settings from one referral backend."
      activePath="/admin/referrals"
    >
      <SectionCard title="Current referral settings" description="These values drive /r/:code redirects without regenerating links.">
        <div className="grid-three">
          <div className="mini-row"><span>Base route</span><strong>{data.settings.referralBaseRoute}</strong></div>
          <div className="mini-row"><span>Launch state</span><strong>{data.settings.appLaunchState}</strong></div>
          <div className="mini-row"><span>Commission</span><strong>{data.settings.commissionType} / {data.settings.commissionValue}</strong></div>
        </div>
      </SectionCard>

      <SectionCard title="Affiliate performance" description="Each affiliate only sees their own view in the affiliate dashboard.">
        <DataTable
          headers={["Affiliate", "Code", "Clicks", "Signups", "Conversions", "Subscribers", "Pending", "Paid"]}
          rows={data.affiliates.map((row) => [
            <div key={`${row.affiliateUserId}-name`}>
              <strong>{row.affiliateName}</strong>
              <div className="note-text">{row.email}</div>
            </div>,
            row.referralCode,
            row.clicks,
            row.signups,
            row.conversions,
            row.subscribers,
            formatMoney(row.pendingPayout),
            formatMoney(row.paidAmount),
          ])}
        />
      </SectionCard>

      <div className="grid-two">
        <SectionCard title="Recent clicks">
          <DataTable
            headers={["Code", "Platform", "Country", "Destination", "Clicked"]}
            rows={data.clicks.slice(0, 20).map((row) => [row.code, row.platform, row.country, row.destination, formatDate(row.clickedAt)])}
          />
        </SectionCard>

        <SectionCard title="Recent conversions">
          <DataTable
            headers={["Code", "Plan", "Amount", "Status", "Converted"]}
            rows={data.conversions.slice(0, 20).map((row) => [
              row.code,
              row.subscriptionPlan,
              formatMoney(row.amount),
              row.status,
              formatDate(row.convertedAt),
            ])}
          />
        </SectionCard>
      </div>
    </AdminFrame>
  );
}
