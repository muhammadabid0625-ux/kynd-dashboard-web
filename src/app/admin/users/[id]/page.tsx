import { notFound } from "next/navigation";

import { AdminFrame } from "@/components/dashboard/AdminFrame";
import { DataTable } from "@/components/dashboard/DataTable";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { requireDashboardRole } from "@/lib/server/auth";
import { getAdminUserDetail } from "@/lib/server/dashboard-data";
import { formatDate, formatMoney } from "@/lib/server/format";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireDashboardRole("admin");
  const { id } = await params;
  const detail = await getAdminUserDetail(id);

  if (!detail) {
    notFound();
  }

  return (
    <AdminFrame
      session={session}
      heading={detail.name}
      description="Detailed finance and lifecycle view for one user."
      activePath="/admin/users"
    >
      <div className="grid-three">
        <SectionCard title="Identity">
          <div className="stack">
            <div className="mini-row"><span>Email</span><strong>{detail.email}</strong></div>
            <div className="mini-row"><span>Country</span><strong>{detail.country}</strong></div>
            <div className="mini-row"><span>Timezone</span><strong>{detail.timezone}</strong></div>
            <div className="mini-row"><span>Last active</span><strong>{formatDate(detail.lastActive)}</strong></div>
          </div>
        </SectionCard>

        <SectionCard title="Finance counts">
          <div className="stack">
            <div className="mini-row"><span>Goals</span><strong>{detail.goalCount}</strong></div>
            <div className="mini-row"><span>Transactions</span><strong>{detail.transactionCount}</strong></div>
            <div className="mini-row"><span>Check-ins</span><strong>{detail.checkInCount}</strong></div>
            <div className="mini-row"><span>Check-outs</span><strong>{detail.checkOutCount}</strong></div>
          </div>
        </SectionCard>

        <SectionCard title="Savings state">
          <div className="stack">
            <div className="mini-row"><span>Referral source</span><strong>{detail.referralSource}</strong></div>
            <div className="mini-row"><span>Savings activity</span><strong>{detail.savingsActivityCount}</strong></div>
            <div className="mini-row"><span>Total saved</span><strong>{formatMoney(detail.totalSaved)}</strong></div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Current goals">
        <DataTable
          headers={["Goal", "Target", "Saved"]}
          rows={detail.currentGoals.map((goal) => [goal.name, formatMoney(goal.targetAmount), formatMoney(goal.currentSaved)])}
        />
      </SectionCard>

      <SectionCard title="Recent transactions">
        <DataTable
          headers={["Date", "Type", "Category", "Amount", "Note"]}
          rows={detail.recentTransactions.map((item) => [
            formatDate(item.date),
            item.type,
            item.category,
            formatMoney(item.amount),
            item.note || "—",
          ])}
        />
      </SectionCard>
    </AdminFrame>
  );
}
