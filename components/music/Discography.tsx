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
  const [isMobile, setIsMobile] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  /* ---------------------------------- */
  /* Mobile Detection */
  /* ---------------------------------- */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ---------------------------------- */
  /* Global Audio Listener */
  /* ---------------------------------- */
  useEffect(() => {
    const handleGlobalAudio = (e: any) => {
      if (e.detail.source !== "music-cards") {
        stopMusic();
      }
    };

    window.addEventListener("global-audio-play", handleGlobalAudio);
    return () =>
      window.removeEventListener("global-audio-play", handleGlobalAudio);
  }, []);

  /* ---------------------------------- */
  /* Play / Stop Music */
  /* ---------------------------------- */
  const playMusic = (id: number, src?: string) => {
    if (!src) return;

    window.dispatchEvent(
      new CustomEvent("global-audio-play", {
        detail: { source: "music-cards" },
      })
    );

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

  /* ---------------------------------- */
  /* Cursor Follow (Desktop Only) */
  /* ---------------------------------- */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;

    setPosition({
      x: e.clientX + 30,
      y: e.clientY - 120,
    });
  };

  return (
    <section className=" light relative min-h-screen px-4 md:px-10 py-12 md:py-16">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">
          STR Discography
        </h1>
        <p className="text-neutral-500 mt-2 text-sm md:text-base">
          Live. Loud. Unfiltered.
        </p>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden md:grid grid-cols-5 text-sm text-neutral-500 pb-4 border-b border-neutral-300">
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
              if (!isMobile) {
                setHoveredSong(song);
                playMusic(idx, song.music);
              }
            }}
            onMouseLeave={() => {
              if (!isMobile) {
                setHoveredSong(null);
                stopMusic();
              }
            }}
            onMouseMove={handleMouseMove}
            onTouchStart={() => {
              if (isMobile) {
                setHoveredSong(song);
                playMusic(idx, song.music);
              }
            }}
            onTouchEnd={() => {
              if (isMobile) {
                setHoveredSong(null);
                stopMusic();
              }
            }}
            className="
              grid grid-cols-2 md:grid-cols-5 
              gap-y-2 md:gap-y-0
              py-4 md:py-5 
              border-b border-neutral-300 
              items-center 
              transition-all duration-300 
              md:hover:bg-neutral-200
              cursor-pointer
            "
          >
            {/* Track */}
            <span className="text-base md:text-lg font-medium">
              {song.trackNo.padStart(2, "0")}
            </span>

            {/* Title */}
            <span className="text-base md:text-lg font-medium md:hover:text-green-500 transition-colors">
              {song.name}
            </span>

            {/* Album */}
            <span className="col-span-2 md:col-span-1 text-sm md:text-base text-neutral-600">
              {song.album}
            </span>

            {/* Year */}
            <span className="text-sm md:text-base text-neutral-600">
              {song.year}
            </span>

            {/* Duration */}
            <span className="text-sm md:text-base text-neutral-600">
              {song.duration}
            </span>
          </div>
        ))}
      </div>

      {/* Floating Cover Image */}
      <div
        className={`
          fixed pointer-events-none z-50
          transition-all duration-300 ease-out mask-contain mask-no-repeat mask-center
          mask-[url(/album_cover_shper.png)] aspect-square 
          ${hoveredSong ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
        style={{
          top: isMobile ? "50%" : position.y,
          left: isMobile ? "50%" : position.x,
          transform: isMobile
            ? "translate(-50%, -50%)"
            : "translate(0, 0)",
        }}
      >
        {hoveredSong && (
          <img
            src={hoveredSong.coverImage}
            alt={hoveredSong.name}
            className="w-40 md:w-48 h-40 md:h-48 object-cover rounded-xl shadow-2xl"
          />
        )}
      </div>
    </section>
  );
};

export default Discography;