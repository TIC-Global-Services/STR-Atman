import MembershipHero from "@/components/membership/MembershipHero";
import CommunitySection from "@/components/membership/CommunitySection";
import AdmirationSection from "@/components/membership/AdmirationSection";
import ShareMomentSection from "@/components/membership/ShareMomentSection";
import CTASection from "@/components/about/CTASection";
import ContourBackground from "@/components/reuseable/ContourBackground";

export default function MembershipPage() {
  return (
    <main className="relative min-h-screen">
      <MembershipHero />
      <ContourBackground
        background="#ffffff"
        lineColor="#7a825c"
        speed={0.03}
        resolution={20}
        levels={9}
      >
        <CommunitySection />
        <AdmirationSection />
        <ShareMomentSection />
        <CTASection />
      </ContourBackground>
    </main>
  );
}
