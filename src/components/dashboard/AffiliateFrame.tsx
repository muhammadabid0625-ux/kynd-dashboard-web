import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { affiliateNav } from "@/lib/data/navigation";
import type { DashboardSession } from "@/types/dashboard";

type AffiliateFrameProps = {
  session: DashboardSession;
  heading: string;
  description: string;
  activePath: string;
  children: ReactNode;
};

export function AffiliateFrame({
  session,
  heading,
  description,
  activePath,
  children,
}: AffiliateFrameProps) {
  return (
    <DashboardShell
      heading={heading}
      description={description}
      navTitle="Affiliate Hub"
      navSubtitle="Your referral workspace"
      navItems={affiliateNav}
      activePath={activePath}
      userName={session.displayName}
      roleLabel="Affiliate"
      sidebarFooter={
        <form action="/api/auth/logout" method="post" className="logout-form">
          <button className="button button-secondary" type="submit">
            Logout
          </button>
        </form>
      }
    >
      {children}
    </DashboardShell>
  );
}
