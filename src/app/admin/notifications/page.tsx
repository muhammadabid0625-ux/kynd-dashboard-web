import { AdminFrame } from "@/components/dashboard/AdminFrame";
import { Badge } from "@/components/dashboard/Badge";
import { DataTable } from "@/components/dashboard/DataTable";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { requireDashboardRole } from "@/lib/server/auth";
import { createManualNotificationLog, saveNotificationTemplate } from "@/lib/server/actions";
import { getNotificationCenterData } from "@/lib/server/dashboard-data";
import { formatDate } from "@/lib/server/format";

export default async function AdminNotificationsPage() {
  const session = await requireDashboardRole("admin");
  const data = await getNotificationCenterData();
  const firstTemplate = data.templates[0];

  return (
    <AdminFrame
      session={session}
      heading="Notifications"
      description="Manage timezone-based notification templates, manual sends, and delivery logs."
      activePath="/admin/notifications"
    >
      <div className="grid-two">
        <SectionCard
          title="Template editor"
          description="This includes title, body, and emphasis text for user-specific notifications."
        >
          <form action={saveNotificationTemplate} className="stack">
            <input type="hidden" name="id" defaultValue={firstTemplate?.id ?? "morning"} />
            <label className="field">
              <span>Template key</span>
              <input name="key" defaultValue={firstTemplate?.key ?? "morning_safe_limit"} required />
            </label>
            <div className="form-grid">
              <label className="field">
                <span>Title</span>
                <input name="title" defaultValue={firstTemplate?.title ?? ""} required />
              </label>
              <label className="field">
                <span>Send hour (local time)</span>
                <input name="sendHourLocal" type="number" min="0" max="23" defaultValue={firstTemplate?.sendHourLocal ?? 9} />
              </label>
            </div>
            <label className="field">
              <span>Body</span>
              <textarea name="body" defaultValue={firstTemplate?.body ?? ""} required />
            </label>
            <label className="field">
              <span>Emphasis text</span>
              <input
                name="emphasisText"
                defaultValue={firstTemplate?.emphasisText ?? ""}
                placeholder="Short bold/semi-bold line for highlighted notification text"
              />
            </label>
            <div className="form-grid">
              <label className="field">
                <span>Audience</span>
                <select name="audience" defaultValue={firstTemplate?.audience ?? "all_users"}>
                  <option value="all_users">All users</option>
                  <option value="paid_users">Paid users</option>
                  <option value="specific_user">Specific user</option>
                </select>
              </label>
              <label className="field">
                <span>Enabled</span>
                <select name="enabled" defaultValue={firstTemplate?.enabled ? "on" : "off"}>
                  <option value="on">Enabled</option>
                  <option value="off">Disabled</option>
                </select>
              </label>
            </div>
            <button className="button button-primary" type="submit">
              Save template
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Manual send / test queue" description="Queue a notification log for a specific user or a generic test payload.">
          <form action={createManualNotificationLog} className="stack">
            <label className="field">
              <span>User ID</span>
              <input name="userId" placeholder="Optional Supabase user id" />
            </label>
            <label className="field">
              <span>Title</span>
              <input name="title" placeholder="Specific alert title" required />
            </label>
            <label className="field">
              <span>Body</span>
              <textarea name="body" placeholder="Notification body text" required />
            </label>
            <label className="field">
              <span>Emphasis text</span>
              <input name="emphasisText" placeholder="Optional bold/semi-bold preview text" />
            </label>
            <label className="field">
              <span>Timezone</span>
              <input name="timezone" defaultValue="UTC" />
            </label>
            <button className="button button-secondary" type="submit">
              Queue notification log
            </button>
          </form>
          <p className="note-text">Registered push tokens currently stored: {data.pushTokenCount}</p>
        </SectionCard>
      </div>

      <SectionCard title="Delivery logs" description="Morning, night, and manual notification activity.">
        <DataTable
          headers={["Status", "Template", "Title", "Emphasis", "Timezone", "Scheduled", "Sent"]}
          rows={data.logs.map((log) => [
            <Badge key={`${log.id}-status`}>{log.status}</Badge>,
            log.templateKey,
            log.title,
            log.emphasisText || "—",
            log.timezone,
            formatDate(log.scheduledFor),
            formatDate(log.sentAt),
          ])}
        />
      </SectionCard>
    </AdminFrame>
  );
}
