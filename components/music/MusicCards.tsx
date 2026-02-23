"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { easeInOut } from "framer-motion";
import BlurText from "../reuseable/BlurText";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* TYPES + DATA */
/* ------------------------------------------------------------------ */

interface MusicCard {
  id: number;
  title: string;
  image: string;
  hasVinyl?: boolean;
  mp3?: string;
  spotify: string;
}

const musicData: MusicCard[] = [
  {
    id: 1,
    title: "Vallavan",
    image: "/record1.png",
    hasVinyl: true,
    mp3: "/music/loosu_penne.mp3",
    spotify:
      "https://open.spotify.com/album/7JfTOsi6jeQ1HQXSPKC5NV?si=71OZ3kDIRvSkikVK4TXDHQ",
  },
  {
    id: 2,
    title: "Vaanam",
    image: "/record2.png",
    hasVinyl: true,
    mp3: "/music/vaanam.mp3",
    spotify:
      "https://open.spotify.com/album/3K2WMhR111JhiLj9VH36Q0?si=NJWmVq0URIa4lyC48YTelQ",
  },
  {
    id: 3,
    title: "Silambaatam",
    image: "/record3.jpg",
    hasVinyl: true,
    mp3: "/music/silambattam.mp3",
    spotify:
      "https://open.spotify.com/album/5qNjtmLsvjileYcRc9OV5d?si=UvL7COFsTc-GHlYgAod6vw",
  },
  {
    id: 4,
    title: "Poda Podi",
    image: "/record4.png",
    hasVinyl: true,
    mp3: "/music/love_pannalama.mp3",
    spotify:
      "https://open.spotify.com/album/2f4wyBEqLUG9e4GqNdZmUC?si=G9GqxmDpSNqft0-1gbF6UA",
  },
  {
    id: 5,
    title: "Love Anthem",
    image: "/record5.jpg",
    hasVinyl: true,
    mp3: "/music/str_love_anthem.mp3",
    spotify:
      "https://open.spotify.com/track/08lOkRQHSldxKtsyoRWtbK?si=b4659171334a44a1",
  },
  {
    id: 6,
    title: "Kaalai",
    image: "/record6.png",
    hasVinyl: true,
    mp3: "/music/kutti_pisase.mp3",
    spotify:
      "https://open.spotify.com/album/3mu1zmRwB8MAaNTo695j4f?si=vbUpubOXQMGx_IGYgaQvGg",
  },
];

/* ------------------------------------------------------------------ */
/* FLOAT ANIMATION */
/* ------------------------------------------------------------------ */

const cardFloat = (i: number) => ({
  y: [0, -12, 0],
  transition: {
    duration: 2 + i * 0.25,
    repeat: Infinity,
    ease: easeInOut,
  },
});

/* ------------------------------------------------------------------ */
/* COMPONENT */
/* ------------------------------------------------------------------ */

const MusicCards = () => {
  const [activeVinyl, setActiveVinyl] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  return (
    <section className=" light relative w-full pt-32 py-[8vh] px-[clamp(1rem,4vw,4rem)]">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="md:text-center mb-[clamp(3rem,8vw,6rem)]">
          <BlurText
            text=" Where emotion finds a voice"
            delay={60}
            animateBy="words"
            direction="top"
            className="text-black font-medium mb-3 text-[clamp(1.8rem,4vw,3rem)]"
          />
          <BlurText
            text=" Music has always been a personal space for Silambarasan TR — a way
            to express what words and performances sometimes cannot. From
            lending his voice to meaningful songs to being deeply involved in
            the musical spirit of his films, music has remained an essential
            part of the journey."
            delay={5}
            animateBy="words"
            direction="top"
            className="text-gray-600 max-w-4xl mx-auto tracking-tight text-[clamp(0.95rem,1.8vw,1.125rem)]"
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(1.5rem,4vw,3rem)] ">
          {musicData.map((music) => {
            const isActive = activeVinyl === music.id;

            return (
              <motion.div
                key={music.id}
                animate={!isMobile ? cardFloat(music.id) : {}}
                whileHover={{ y: -8 }}
                onHoverStart={() => {
                  if (!isMobile) playMusic(music.id, music.mp3);
                }}
                onHoverEnd={() => {
                  if (!isMobile) stopMusic();
                }}
                onClick={() => {
                  if (!isMobile) return;
                  const next = isActive ? null : music.id;
                  setActiveVinyl(next);
                  next ? playMusic(music.id, music.mp3) : stopMusic();
                }}
                className="group flex flex-col items-center cursor-pointer"
              >
                <Link
                  href={music.spotify}
                  target="_blank"
                  onClick={() => {
                    stopMusic();
                  }}
                >
                  <div className="relative mb-4">
                    {/* ALBUM */}
                    <div className="relative aspect-square w-[clamp(180px,28vw,270px)] rounded-lg overflow-hidden shadow-xl z-10">
                      <Image
                        src={music.image}
                        alt={music.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* VINYL — DESIGN UNCHANGED */}
                    {music.hasVinyl && (
                      <div
                        className={`
                        absolute inset-0 z-0
                        transition-transform duration-700 ease-out
                        ${
                          isMobile
                            ? isActive
                              ? "translate-x-[50%]"
                              : "translate-x-0"
                            : "group-hover:translate-x-[50%]"
                        }
                      `}
                      >
                        <div
                          className={`
                          relative w-full h-full rounded-full
                          bg-gradient-to-br from-gray-900 via-black to-gray-900
                          shadow-2xl
                          ${playingId === music.id ? " animate-spin-slow" : ""}
                        `}
                        >
                          {/* Grooves */}
                          {[...Array(18)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute rounded-full border border-gray-700"
                              style={{
                                inset: `${i * 3}%`,
                                opacity: 0.25 - i * 0.01,
                              }}
                            />
                          ))}

                          {/* Center label */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] aspect-square rounded-full overflow-hidden border-[3px] border-gray-800 shadow-inner">
                            <Image
                              src={music.image}
                              alt={music.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Center hole */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6%] aspect-square rounded-full bg-black border border-gray-600" />

                          {/* Shine */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-60" />
                        </div>
                      </div>
                    )}
                  </div>
                </Link>

                <h3 className="font-medium text-xl pt-2 text-black text-center">
                  {music.title}
                </h3>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center py-14">
          <Link
            href="https://open.spotify.com/artist/5Hn84AFwiTEi8eMoI5B9AS?si=K_R-inUlS3GNdi95fLZIUg"
            target="_blank"
            className="group flex items-center gap-2 text-gray-600 hover:text-black transition"
          >
            <span className="text-[clamp(1rem,1.8vw,1.125rem)]">Know More</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MusicCards;
