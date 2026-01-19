import MembershipHero from '@/components/membership/MembershipHero';
import CommunitySection from '@/components/membership/CommunitySection';
import AdmirationSection from '@/components/membership/AdmirationSection';
import ShareMomentSection from '@/components/membership/ShareMomentSection';
import CTASection from '@/components/about/CTASection';

export default function MembershipPage() {
  return (
    <main className="relative min-h-screen">
      <MembershipHero />
      <CommunitySection />
      <AdmirationSection />
      <ShareMomentSection />
      <CTASection />
    </main>
  );
}