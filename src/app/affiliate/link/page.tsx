import { AffiliateFrame } from "@/components/dashboard/AffiliateFrame";
import { CopyButton } from "@/components/dashboard/CopyButton";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { requireDashboardRole } from "@/lib/server/auth";
import { getAffiliateDashboardData } from "@/lib/server/dashboard-data";

export default async function AffiliateLinkPage() {
  const session = await requireDashboardRole("affiliate");
  const data = await getAffiliateDashboardData(session.userId);

  return (
    <AffiliateFrame
      session={session}
      heading="Referral link"
      description="Copy and share your permanent affiliate link. The admin dashboard can change destinations later without changing your link."
      activePath="/affiliate/link"
    >
      <SectionCard title="Your unique link">
        <div className="mini-row">
          <div>
            <strong>{data?.referralLink ?? "No referral code yet"}</strong>
            <div className="note-text">Share this link in campaigns, bios, WhatsApp, and landing pages.</div>
          </div>
          {data?.referralLink ? <CopyButton value={data.referralLink} /> : null}
        </div>
      </SectionCard>
    </AffiliateFrame>
  );
}
