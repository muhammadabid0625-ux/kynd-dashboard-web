import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { adminNav } from "@/lib/data/navigation";
import type { DashboardSession } from "@/types/dashboard";

type AdminFrameProps = {
  session: DashboardSession;
  heading: string;
  description: string;
  activePath: string;
  children: ReactNode;
};

export function AdminFrame({ session, heading, description, activePath, children }: AdminFrameProps) {
  return (
    <DashboardShell
      heading={heading}
      description={description}
      navTitle="Admin Control"
      navSubtitle="Private operations"
      navItems={adminNav}
      activePath={activePath}
      userName={session.displayName}
      roleLabel="Administrator"
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
