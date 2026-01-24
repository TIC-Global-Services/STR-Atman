import HorizontalImageGallery from "@/components/home/HorizontalImageGallery";
import ContourBackground from "@/components/reuseable/ContourBackground";
import VideoSection from "@/components/reuseable/VideoSection";
import STRAbout from "@/components/home/STRAbout";
import LatestUpdates from "@/components/home/LatestUpdates";
import Timeline from "@/components/home/Timeline";
import Stories from "@/components/home/Stories";
import HomeHero from "@/components/home/HomeHero";
import Hero from "@/components/home/hero";

export default function Home() {
  return (
    <div className=" overflow-hidden">
      <HomeHero />
      {/* <Hero /> */}
      <ContourBackground background="#ffffff" lineColor="#7a825c" speed={0.03} resolution={10} levels={10}>
        <STRAbout />
        <Timeline />
        <LatestUpdates />
        <HorizontalImageGallery />
        <VideoSection videoId="xkHtjS58Dds" />
        <Stories />
      </ContourBackground>
    </div>
  );
}
