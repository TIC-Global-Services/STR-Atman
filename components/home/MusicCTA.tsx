"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const AUDIO_SRC = "/music/voice_of_unity.mp3";

const MusicCTA = () => {
  const [playing, setPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // New state for animation
  const [isMobile, setIsMobile] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringSection, setIsHoveringSection] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  /* -------------------------------------------------- */
  /* BROWSER AUDIO UNLOCKER */
  /* -------------------------------------------------- */
  useEffect(() => {
    const unlock = () => {
      setAudioUnlocked(true);
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  /* -------------------------------------------------- */
  /* MOBILE CHECK */
  /* -------------------------------------------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* -------------------------------------------------- */
  /* AUDIO LOGIC */
  /* -------------------------------------------------- */
  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlaying(false);
  }, []);

  const playMusic = useCallback(() => {
    if (!audioUnlocked) return;
    if (audioRef.current) audioRef.current.pause();

    const audio = new Audio(AUDIO_SRC);
    audio.volume = 0.7;
    audio.play()
      .then(() => {
        audioRef.current = audio;
        setPlaying(true);
      })
      .catch((err) => console.warn("Playback blocked:", err));
  }, [audioUnlocked]);

  /* -------------------------------------------------- */
  /* LOCAL MOUSE TRACKER */
  /* -------------------------------------------------- */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (audioUnlocked || isMobile) return;
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHoveringSection(true)}
      onMouseLeave={() => setIsHoveringSection(false)}
      className={`min-h-screen flex flex-col items-center justify-center gap-10 relative overflow-hidden pb-20 transition-colors duration-500
        ${!audioUnlocked && isHoveringSection && !isMobile ? "cursor-none" : "cursor-default"}`}
    >
      {/* LOCALIZED FLOATING CURSOR HINT */}
      <AnimatePresence>
        {!audioUnlocked && !isMobile && isHoveringSection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed pointer-events-none z-[9999] flex flex-row items-center gap-2"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-3 h-3 bg-black rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            <span className="whitespace-nowrap text-[8px] uppercase tracking-[0.2em] font-bold text-white bg-black/80 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
              Click to unlock music
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl md:text-6xl font-semibold text-center pointer-events-none select-none"
      >
        Feel the Sound.
        <br />
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
        whileHover={{ y: -10 }}
        onHoverStart={() => {
          setIsHovered(true); // Trigger animation immediately
          if (!isMobile) playMusic();
        }}
        onHoverEnd={() => {
          setIsHovered(false); // Hide animation
          if (!isMobile) stopMusic();
        }}
        onClick={() => {
          if (isMobile) {
            playing ? stopMusic() : playMusic();
          }
        }}
        className="group cursor-pointer relative z-10"
      >
        <div className="relative mb-6">
          <div className="relative aspect-square w-[clamp(180px,65vw,360px)] rounded-xl overflow-hidden shadow-2xl z-10">
            <Image
              src="/musical/voice_of_unity.jpg"
              alt="Voice Of Unity"
              fill
              className="object-cover"
            />
          </div>

          <motion.div
            animate={{ x: isHovered ? "55%" : "0%" }} // Use isHovered instead of playing
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <motion.div
              animate={{ rotate: playing ? 360 : 0 }}
              transition={{
                repeat: playing ? Infinity : 0,
                duration: 4,
                ease: "linear",
              }}
              className="relative w-full h-full rounded-full bg-gradient-to-br from-neutral-900 via-black to-neutral-900 shadow-2xl"
            >
              {[...Array(18)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-neutral-700"
                  style={{ inset: `${i * 3}%`, opacity: 0.25 - i * 0.01 }}
                />
              ))}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] aspect-square rounded-full overflow-hidden border-[3px] border-neutral-800">
                <Image src="/musical/voice_of_unity.jpg" alt="Label" fill className="object-cover" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6%] aspect-square rounded-full bg-black border border-neutral-600" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
            </motion.div>
          </motion.div>
        </div>

        <h3 className="text-xl text-center font-medium">Voice of Unity</h3>
      </motion.div>

      <Link href="/music-journey" onClick={()=>stopMusic()} className=" text-sm text-neutral-500 hover:text-neutral-700  transition-colors z-20">
        Explore Musical Journey →
      </Link>
    </section>
  );
};

export default MusicCTA;