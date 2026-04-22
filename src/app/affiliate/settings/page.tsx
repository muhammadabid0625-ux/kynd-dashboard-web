import { AffiliateFrame } from "@/components/dashboard/AffiliateFrame";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { requireDashboardRole } from "@/lib/server/auth";
import { saveAffiliateSettings } from "@/lib/server/actions";
import { getAffiliateDashboardData } from "@/lib/server/dashboard-data";

export default async function AffiliateSettingsPage() {
  const session = await requireDashboardRole("affiliate");
  const data = await getAffiliateDashboardData(session.userId);

  return (
    <AffiliateFrame
      session={session}
      heading="Affiliate settings"
      description="Update your payout method placeholder and personal affiliate profile details."
      activePath="/affiliate/settings"
    >
      <SectionCard title="Profile and payout settings">
        <form action={saveAffiliateSettings} className="stack">
          <label className="field">
            <span>Display name</span>
            <input value={data?.profile.displayName ?? ""} readOnly />
          </label>
          <label className="field">
            <span>Referral code</span>
            <input value={data?.profile.referralCode ?? ""} readOnly />
          </label>
          <label className="field">
            <span>Payout method</span>
            <select name="payoutMethod" defaultValue={data?.profile.payoutMethod ?? "bank_transfer"}>
              <option value="bank_transfer">Bank transfer</option>
              <option value="paypal">PayPal</option>
              <option value="manual_review">Manual review</option>
            </select>
          </label>
          <label className="field">
            <span>Payout details</span>
            <textarea name="payoutDetails" defaultValue={data?.profile.payoutDetails ?? ""} />
          </label>
          <button className="button button-primary" type="submit">
            Save settings
          </button>
        </form>
      </SectionCard>
    </AffiliateFrame>
  );
}
