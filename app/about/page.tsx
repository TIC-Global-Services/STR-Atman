import AboutHero from "@/components/about/AboutHero";
import Journey from "@/components/about/Journey";
import VideoSection from "@/components/about/VideoSection";
import StackedCards from "@/components/about/StackedCards";
import CTASection from "@/components/about/CTASection";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Journey />
      <VideoSection />
      <StackedCards />
      <CTASection />
    </>
  );
}
