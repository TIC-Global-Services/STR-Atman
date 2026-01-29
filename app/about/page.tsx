import AboutHero from "@/components/about/AboutHero";
import Journey from "@/components/about/Journey";

import StackedCards from "@/components/about/StackedCards";
import CTASection from "@/components/about/CTASection";
import VideoSection from "@/components/reuseable/VideoSection";

export default function AboutPage() {
  return (
    <div className=" overflow-x-hidden">
      <AboutHero />
      <Journey />
      <VideoSection videoId="GamaQkWfOdo" />

      <StackedCards />
      <CTASection />
    </div>
  );
}
