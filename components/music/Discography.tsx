"use client";
import { useEffect, useRef, useState } from "react";
import { SongsList } from "./SongsList";

const Discography = () => {
  const [hoveredSong, setHoveredSong] = useState<{
    trackNo: string;
    name: string;
    album: string;
    year: string;
    duration: string;
    coverImage: string;
    music?: string;
  } | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  useEffect(() => {
    const handleGlobalAudio = (e: any) => {
      // If the event is NOT from music cards → stop preview audio
      if (e.detail.source !== "music-cards") {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
        }
        setPlayingId(null);
      }
    };

    window.addEventListener("global-audio-play", handleGlobalAudio);

    return () => {
      window.removeEventListener("global-audio-play", handleGlobalAudio);
    };
  }, []);

  const playMusic = (id: number, src?: string) => {
    if (!src) return;

    // 🔊 Tell entire site: music card audio is playing
    window.dispatchEvent(
      new CustomEvent("global-audio-play", {
        detail: { source: "music-cards" },
      }),
    );

    // Stop previous music card audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);
    audio.volume = 0.7;
    audio.play().catch(() => {});
    audioRef.current = audio;

    setPlayingId(id);
  };

  const stopMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;
    setPlayingId(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({
      x: e.clientX + 30,
      y: e.clientY - 120,
    });
  };

  return (
    <div className="relative min-h-screen px-10 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-semibold tracking-tight">
          STR Discography
        </h1>
        <p className="text-neutral-500 mt-2">Live. Loud. Unfiltered.</p>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 text-sm text-neutral-500 pb-4 border-b border-neutral-300">
        <span>Track</span>
        <span>Title</span>
        <span>Film / Album</span>
        <span>Year</span>
        <span>Duration</span>
      </div>

      {/* Songs List */}
      <div>
        {SongsList.map((song, idx) => (
          <div
            key={idx}
            onMouseEnter={() => {
              setHoveredSong(song);
              playMusic(idx, song.music); // 🔥 play preview
            }}
            onMouseLeave={() => {
              setHoveredSong(null);
              stopMusic(); // 🛑 stop preview
            }}
            onMouseMove={handleMouseMove}
            className="grid grid-cols-5 py-5 border-b border-neutral-300 items-center cursor-pointer 
                       transition-all duration-300 hover:bg-neutral-200"
          >
            <span className="text-lg font-medium">
              {song.trackNo.padStart(2, "0")}
            </span>

            <span className="text-lg font-medium hover:text-green-500 transition-colors">
              {song.name}
            </span>

            <span>{song.album}</span>
            <span>{song.year}</span>
            <span>{song.duration}</span>
          </div>
        ))}
      </div>

      {/* Floating Cover Image */}
      <div
        className={`fixed pointer-events-none z-50 transition-all mask-contain mask-no-repeat mask-center
          mask-[url(/album_cover_shper.png)] aspect-square duration-300 ease-out
          ${hoveredSong ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={{
          top: position.y,
          left: position.x,
        }}
      >
        {hoveredSong && (
          <img
            src={`${hoveredSong.coverImage}`}
            alt={hoveredSong.name}
            className="w-48 h-48 object-cover rounded-lg shadow-2xl"
          />
        )}
      </div>
    </div>
  );
};

export default Discography;
