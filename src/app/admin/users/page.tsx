import Link from "next/link";

import { AdminFrame } from "@/components/dashboard/AdminFrame";
import { Badge } from "@/components/dashboard/Badge";
import { DataTable } from "@/components/dashboard/DataTable";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { requireDashboardRole } from "@/lib/server/auth";
import { getAdminUsers } from "@/lib/server/dashboard-data";
import { formatDate } from "@/lib/server/format";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireDashboardRole("admin");
  const users = await getAdminUsers();
  const params = await searchParams;
  const qValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (qValue || "").toLowerCase().trim();
  const filtered = query
    ? users.filter((user) =>
        [user.name, user.email, user.country, user.referralSource].some((field) =>
          field.toLowerCase().includes(query),
        ),
      )
    : users;

  return (
    <AdminFrame
      session={session}
      heading="Users"
      description="Searchable user monitoring for finance state, activity cadence, and referral attribution."
      activePath="/admin/users"
    >
      <SectionCard title="User list" description="Every finance profile currently known to the system.">
        <form className="inline-actions" method="get" style={{ marginBottom: "1rem" }}>
          <input
            name="q"
            placeholder="Search by name, email, country, or referral code"
            defaultValue={query}
            style={{
              minWidth: "320px",
              minHeight: "3.1rem",
              padding: "0.9rem 1rem",
              borderRadius: "14px",
              border: "1px solid rgba(17, 64, 47, 0.1)",
              background: "white",
            }}
          />
          <button className="button button-secondary" type="submit">
            Search
          </button>
        </form>
        <DataTable
          headers={["User", "Country", "Subscription", "Last active", "Goals", "Transactions", "Referral"]}
          rows={filtered.map((user) => [
            <div key={`${user.userId}-name`}>
              <Link href={`/admin/users/${user.userId}`} style={{ fontWeight: 800 }}>
                {user.name}
              </Link>
              <div className="note-text">{user.email}</div>
            </div>,
            user.country,
            <Badge key={`${user.userId}-subscription`}>{user.subscriptionStatus}</Badge>,
            formatDate(user.lastActive),
            user.goalCount,
            user.transactionCount,
            user.referralSource,
          ])}
        />
      </SectionCard>
    </AdminFrame>
  );
}
