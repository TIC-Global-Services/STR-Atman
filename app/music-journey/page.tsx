"use client";
import MusicHero from "@/components/music/MusicHero";
import MusicCards from "@/components/music/MusicCards";
import FilmStrip from "@/components/music/FilmStrip";
import Waves from "@/components/reuseable/Waves";
import ContourBackground from "@/components/reuseable/ContourBackground";
import Discography from "@/components/music/Discography";

export default function MusicJourneyPage() {
  return (
    <main className="relative min-h-screen">
      {/* <MusicHero /> */}

      <ContourBackground
        background="#ffffff"
        lineColor="#7a825c"
        speed={0.03}
        resolution={20}
        levels={9}
      >
        <MusicCards />
        <FilmStrip />
        <Discography />
      </ContourBackground>
    </main>
  );
}
