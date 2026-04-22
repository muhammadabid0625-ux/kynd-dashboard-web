import type { ReactNode } from "react";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

type DashboardShellProps = {
  heading: string;
  description: string;
  navTitle: string;
  navSubtitle: string;
  navItems: Array<{ href: string; label: string; icon: string }>;
  activePath: string;
  userName: string;
  roleLabel: string;
  sidebarFooter?: ReactNode;
  children: ReactNode;
};

export function DashboardShell({
  heading,
  description,
  navTitle,
  navSubtitle,
  navItems,
  activePath,
  userName,
  roleLabel,
  sidebarFooter,
  children,
}: DashboardShellProps) {
  return (
    <div className="dashboard-shell">
      <Sidebar
        title={navTitle}
        subtitle={navSubtitle}
        items={navItems}
        activePath={activePath}
        footer={sidebarFooter}
      />
      <main className="dashboard-main">
        <Topbar heading={heading} description={description} name={userName} roleLabel={roleLabel} />
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}
