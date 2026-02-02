import AboutHero from "@/components/about/AboutHero";
import Journey from "@/components/about/Journey";

import StackedCards from "@/components/about/StackedCards";
import CTASection from "@/components/about/CTASection";
import VideoSection from "@/components/reuseable/VideoSection";
import ContourBackground from "@/components/reuseable/ContourBackground";

export default function AboutPage() {
  return (
    <div className=" overflow-x-hidden">
      <AboutHero />
      <Journey />
      <VideoSection videoSrc="/video/title-card-final.mp4" />
      <ContourBackground
        background="#ffffff"
        lineColor="#7a825c"
        speed={0.03}
        resolution={20}
        levels={9}
      >
        <StackedCards />
        <CTASection />
      </ContourBackground>
    </div>
  );
}
