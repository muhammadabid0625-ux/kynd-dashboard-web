import { AdminFrame } from "@/components/dashboard/AdminFrame";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { requireDashboardRole } from "@/lib/server/auth";
import { saveReferralSettings } from "@/lib/server/actions";
import { getReferralAdminData } from "@/lib/server/dashboard-data";

export default async function AdminSettingsPage() {
  const session = await requireDashboardRole("admin");
  const { settings } = await getReferralAdminData();

  return (
    <AdminFrame
      session={session}
      heading="Settings"
      description="Control app links, referral routing, commission rules, and dashboard-wide defaults from one place."
      activePath="/admin/settings"
    >
      <SectionCard title="Platform and referral settings" description="When you later add store URLs here, all existing /r/:code links will automatically use them.">
        <form action={saveReferralSettings} className="stack">
          <div className="form-grid">
            <label className="field">
              <span>Play Store URL</span>
              <input name="playStoreUrl" defaultValue={settings.playStoreUrl} placeholder="https://play.google.com/store/apps/details?id=..." />
            </label>
            <label className="field">
              <span>App Store URL</span>
              <input name="appStoreUrl" defaultValue={settings.appStoreUrl} placeholder="https://apps.apple.com/..." />
            </label>
          </div>

          <label className="field">
            <span>Fallback landing page URL</span>
            <input name="fallbackLandingUrl" defaultValue={settings.fallbackLandingUrl} placeholder="https://your-site.com/landing" />
          </label>

          <div className="form-grid">
            <label className="field">
              <span>Referral base route</span>
              <input name="referralBaseRoute" defaultValue={settings.referralBaseRoute} />
            </label>
            <label className="field">
              <span>Default timezone</span>
              <input name="defaultTimezone" defaultValue={settings.defaultTimezone} />
            </label>
          </div>

          <div className="form-grid">
            <label className="field">
              <span>Commission type</span>
              <select name="commissionType" defaultValue={settings.commissionType}>
                <option value="fixed">Fixed</option>
                <option value="percent">Percent</option>
              </select>
            </label>
            <label className="field">
              <span>Commission value</span>
              <input name="commissionValue" type="number" step="0.01" defaultValue={settings.commissionValue} />
            </label>
          </div>

          <div className="form-grid">
            <label className="field">
              <span>App launch state</span>
              <select name="appLaunchState" defaultValue={settings.appLaunchState}>
                <option value="prelaunch">Prelaunch</option>
                <option value="live">Live</option>
              </select>
            </label>
            <label className="field">
              <span>Referral enabled</span>
              <select name="enabled" defaultValue={settings.enabled ? "on" : "off"}>
                <option value="on">Enabled</option>
                <option value="off">Disabled</option>
              </select>
            </label>
          </div>

          <label className="field">
            <span>Notification enabled</span>
            <select name="notificationEnabled" defaultValue="on">
              <option value="on">Enabled</option>
              <option value="off">Disabled</option>
            </select>
          </label>

          <button className="button button-primary" type="submit">
            Save settings
          </button>
        </form>
      </SectionCard>
    </AdminFrame>
  );
}
