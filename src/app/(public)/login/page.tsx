import { redirectForRole, getDashboardSession } from "@/lib/server/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const errorParam = resolved.error;
  const error = Array.isArray(errorParam) ? errorParam[0] : errorParam;
  const session = await getDashboardSession();

  if (session) {
    redirectForRole(session.role);
  }

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-copy">
          <div className="eyebrow">Private operations workspace</div>
          <h2>Run Kynd Saving like a real product.</h2>
          <p>
            Manage users, referrals, payouts, notifications, and app configuration from one
            secure dashboard.
          </p>

          <div className="feature-stack">
            <div className="feature-card">
              <strong>Admin control</strong>
              <span>Users, analytics, payouts, links, and notification systems in one place.</span>
            </div>
            <div className="feature-card">
              <strong>Affiliate workspace</strong>
              <span>Give affiliates a clean dashboard without exposing admin-level data.</span>
            </div>
            <div className="feature-card">
              <strong>Supabase-backed</strong>
              <span>Ready for Vercel deployment and connected to your existing finance backend.</span>
            </div>
          </div>
        </div>

        <LoginForm error={error} />
      </div>
    </div>
  );
}
