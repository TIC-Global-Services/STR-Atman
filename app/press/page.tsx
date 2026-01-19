import PressHero from '@/components/press/PressHero';
import PressSection from '@/components/press/PressSection';
import NewsSection from '@/components/press/NewsSection';
import InstagramSection from '@/components/press/InstagramSection';

export default function PressPage() {
  return (
    <main className="relative min-h-screen">
      <PressHero />
      <PressSection />
      <NewsSection />
      <InstagramSection />
    </main>
  );
}