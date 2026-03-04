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
      <VideoSection videoSrc="/video/title-card-final.mp4" mobVideoSrc="/video/title-card-mobile.mp4" />
      <ContourBackground
        background="#ffffff"
        lineColor="#7a825c"
        resolution={10}
        levels={50}
      >
        <StackedCards />
        <CTASection />
      </ContourBackground>
    </div>
  );
}
