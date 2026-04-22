import { cn } from "@/lib/utils/cn";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "warning";
};

export function StatCard({ label, value, hint, tone = "default" }: StatCardProps) {
  return (
    <div className={cn("stat-card", tone !== "default" && `stat-card-${tone}`)}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {hint ? <div className="stat-hint">{hint}</div> : null}
    </div>
  );
}
