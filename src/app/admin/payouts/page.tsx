import { AdminFrame } from "@/components/dashboard/AdminFrame";
import { DataTable } from "@/components/dashboard/DataTable";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { requireDashboardRole } from "@/lib/server/auth";
import { getPayoutAdminData } from "@/lib/server/dashboard-data";
import { formatDate, formatMoney } from "@/lib/server/format";
import { updatePayoutStatus } from "@/lib/server/actions";

export default async function AdminPayoutsPage() {
  const session = await requireDashboardRole("admin");
  const data = await getPayoutAdminData();

  return (
    <AdminFrame
      session={session}
      heading="Payouts"
      description="Review monthly affiliate earnings, mark payout status, and maintain a clean export-friendly ledger."
      activePath="/admin/payouts"
    >
      <div className="grid-two">
        <SectionCard title="Pending total">
          <div className="stat-value">{formatMoney(data.pendingTotal)}</div>
        </SectionCard>
        <SectionCard title="Paid total">
          <div className="stat-value">{formatMoney(data.paidTotal)}</div>
        </SectionCard>
      </div>

      <SectionCard title="Payout queue">
        <DataTable
          headers={["Affiliate", "Month", "Gross", "Net", "Status", "Paid at", "Update"]}
          rows={data.rows.map((row) => [
            row.affiliateName,
            row.month,
            formatMoney(row.grossAmount),
            formatMoney(row.netAmount),
            row.status,
            formatDate(row.paidAt),
            <form key={`${row.id}-update`} action={updatePayoutStatus} className="inline-actions">
              <input type="hidden" name="payoutId" value={row.id} />
              <select name="status" defaultValue={row.status}>
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="cancelled">cancelled</option>
              </select>
              <input name="note" defaultValue={row.note} placeholder="Optional note" />
              <button className="button button-secondary" type="submit">Save</button>
            </form>,
          ])}
        />
      </SectionCard>
    </AdminFrame>
  );
}
