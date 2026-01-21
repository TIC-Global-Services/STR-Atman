import ContainerLayout from "@/layout/ContainerLayout";
import HorizontalImageGallery from "@/components/Home/HorizontalImageGallery";
import ContourBackground from "@/components/Reuseable/ContourBackground";
import MusicHero from "@/components/music/MusicHero";

export default function Home() {
  return (
    <div className=" overflow-hidden">
      <MusicHero />
      <ContourBackground
        background="#ffffff"
        lineColor="#7a825c"
        speed={0.01}
        className="light"
      >
        <HorizontalImageGallery />
      </ContourBackground>
    </div>
  );
}
