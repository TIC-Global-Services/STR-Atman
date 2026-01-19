import AboutHero from "@/components/about/AboutHero";
import Journey from "@/components/about/Journey";
import VideoSection from "@/components/about/VideoSection";
import StackedCards from "@/components/about/StackedCards";
import CTASection from "@/components/about/CTASection";

export default function AboutPage() {
  return (
    <div className=" overflow-x-hidden">
      <AboutHero />
      <Journey />
      <VideoSection />
      <StackedCards />
      <CTASection />
    </div>
  );
}
