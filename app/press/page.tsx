import PressHero from "@/components/press/PressHero";
import PressSection from "@/components/press/PressSection";
import NewsSection from "@/components/press/NewsSection";
import InstagramSection from "@/components/press/InstagramSection";
import ContourBackground from "@/components/reuseable/ContourBackground";
import XSection from "@/components/press/XSection";

export default function PressPage() {
  return (
    <main className="relative min-h-screen">
      <PressHero />
      <ContourBackground
        background="#ffffff"
        lineColor="#7a825c"
        resolution={10}
        levels={50}
      >
        <PressSection />
        <NewsSection />
        <InstagramSection />
        <XSection />
      </ContourBackground>
    </main>
  );
}
