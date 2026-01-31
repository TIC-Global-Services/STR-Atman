"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const AUDIO_SRC = "/music/voice_of_unity.mp3";

const MusicCTA = () => {
  const [playing, setPlaying] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringSection, setIsHoveringSection] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

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

  const toggleMusic = useCallback(() => {
    if (playing) {
      stopMusic();
    } else {
      // 1. Tell Navbar to stop its audio
      window.dispatchEvent(
        new CustomEvent("global-audio-play", {
          detail: { source: "music-cta" },
        })
      );

      const audio = new Audio(AUDIO_SRC);
      audio.volume = 0.7;
      audio.loop = true;
      audio.play()
        .then(() => {
          audioRef.current = audio;
          setPlaying(true);
        })
        .catch((err) => console.warn("Playback blocked:", err));
    }
  }, [playing, stopMusic]);

  /* -------------------------------------------------- */
  /* GLOBAL SYNC & AUTO-STOP */
  /* -------------------------------------------------- */
  useEffect(() => {
    // Listen for Navbar playing
    const handleGlobalAudio = (e: any) => {
      if (e.detail.source !== "music-cta") {
        stopMusic();
      }
    };

    // Stop if we leave the section
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) stopMusic();
      },
      { threshold: 0.1 }
    );

    window.addEventListener("global-audio-play", handleGlobalAudio);
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      window.removeEventListener("global-audio-play", handleGlobalAudio);
      observer.disconnect();
    };
  }, [stopMusic]);

  /* -------------------------------------------------- */
  /* HELPERS */
  /* -------------------------------------------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      onMouseEnter={() => setIsHoveringSection(true)}
      onMouseLeave={() => setIsHoveringSection(false)}
      onClick={toggleMusic}
      className={` light md:min-h-screen flex flex-col items-center justify-center gap-10 relative overflow-hidden pb-20 transition-colors duration-500
        ${isHoveringSection && !isMobile ? "cursor-none" : "cursor-default"}`}
    >
      <AnimatePresence>
        {isHoveringSection && !isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed pointer-events-none z-[9999] flex flex-row items-center gap-2"
            style={{ left: mousePos.x, top: mousePos.y, transform: "translate(-50%, -50%)" }}
          >
            <div className="w-3 h-3 animate-pulse bg-black rounded-full shadow-[0_0_15px_white]" />
            <span className="whitespace-nowrap text-[8px] uppercase tracking-[0.2em] font-bold text-white bg-black/80 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
              {playing ? "Click to stop" : "Click to play"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h1 className="text-5xl md:text-6xl font-semibold text-center select-none pointer-events-none">
        Feel the Sound.
      </motion.h1>

      <div className="group relative z-10 mr-[25%] md:mr-0">
        <div className="relative mb-6">
          <div className="relative aspect-square w-[clamp(180px,65vw,360px)] rounded-xl overflow-hidden shadow-2xl z-10">
            <Image src="/musical/voice_of_unity.jpg" alt="Cover" fill className="object-cover" />
          </div>

          {/* VINYL DESIGN (Always Visible & Spinning) */}
          <motion.div animate={{ x: "55%" }} transition={{ duration: 0.7 }} className="absolute inset-0 z-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
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
      </div>

      <Link 
        href="/music-journey" 
        onClick={(e) => { e.stopPropagation(); stopMusic(); }} 
        className="text-sm text-neutral-500 hover:text-neutral-700 z-20"
      >
        Explore Musical Journey →
      </Link>
    </section>
  );
};

export default MusicCTA;