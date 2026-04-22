import type { ReactNode } from "react";

import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type SidebarItem = {
  href: string;
  label: string;
  icon: string;
};

type SidebarProps = {
  title: string;
  subtitle: string;
  items: SidebarItem[];
  activePath: string;
  footer?: ReactNode;
};

export function Sidebar({ title, subtitle, items, activePath, footer }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-mark">KS</div>
        <div>
          <div className="sidebar-title">{title}</div>
          <div className="sidebar-subtitle">{subtitle}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const active = activePath === item.href || activePath.startsWith(`${item.href}/`);

          return (
            <Link key={item.href} href={item.href} className={cn("sidebar-link", active && "sidebar-link-active")}>
              <span className="sidebar-link-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {footer ? <div className="sidebar-footer">{footer}</div> : null}
    </aside>
  );
}
