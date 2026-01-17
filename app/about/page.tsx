import AboutHero from "@/components/About/AboutHero";
import Journey from "@/components/About/Journey";
import VideoSection from "@/components/About/VideoSection";
import StackedCards from "@/components/About/StackedCards";
import CTASection from "@/components/About/CTASection";

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
