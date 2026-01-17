"use client";
import MusicHero from '@/components/music/MusicHero';
import MusicCards from '@/components/music/MusicCards';
import FilmStrip from '@/components/music/FilmStrip';
import Waves from '@/components/reuseable/Waves';

export default function MusicJourneyPage() {
  return (
    <main className="relative min-h-screen">
      <MusicHero />
      
      {/* MusicCards section with waves */}
      <div className="relative bg-[#F5F5F5]">
        {/* Waves for this section */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <Waves lineColor="rgba(0,0,0,0.15)" backgroundColor="transparent" />
        </div>
        
        {/* Content */}
        <div className="relative z-20">
          <MusicCards />
        </div>
      </div>
      
      <FilmStrip />
    </main>
  );
}
