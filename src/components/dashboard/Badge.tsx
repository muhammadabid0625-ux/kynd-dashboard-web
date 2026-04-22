import { cn } from "@/lib/utils/cn";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
};

export function Badge({ children, tone = "default" }: BadgeProps) {
  return <span className={cn("badge", tone !== "default" && `badge-${tone}`)}>{children}</span>;
}
