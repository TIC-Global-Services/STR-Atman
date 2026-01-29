"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { easeInOut } from "framer-motion";
import BlurText from "../reuseable/BlurText";

/* ------------------------------------------------------------------ */
/* TYPES + DATA */
/* ------------------------------------------------------------------ */

interface MusicCard {
  id: number;
  title: string;
  image: string;
  hasVinyl?: boolean;
}

const musicData: MusicCard[] = [
  { id: 1, title: "Vallavan", image: "/record1.png", hasVinyl: true },
  { id: 2, title: "Vaanam", image: "/record2.png", hasVinyl: true },
  { id: 3, title: "Silambarasan", image: "/record3.jpg", hasVinyl: true },
  { id: 4, title: "Poda Podi", image: "/record4.png", hasVinyl: true },
  { id: 5, title: "Love Anthem", image: "/record5.jpg", hasVinyl: true },
  { id: 6, title: "Kaalai", image: "/record6.png", hasVinyl: true },
];

/* ------------------------------------------------------------------ */
/* ANIMATION VARIANTS */
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="relative w-full py-[8vh] px-[clamp(1rem,4vw,4rem)]">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(1.5rem,4vw,3rem)] mb-12">
          {musicData.map((music) => {
            const isActive = activeVinyl === music.id;

            return (
              <motion.div
                key={music.id}
                animate={isMobile && isActive ? { y: 0 } : cardFloat(music.id)}
                whileHover={{ y: -8 }}
                onClick={() => {
                  if (!isMobile) return;
                  setActiveVinyl(isActive ? null : music.id);
                }}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="relative mb-4">
                  {/* ALBUM */}
                  <div className="relative aspect-square w-[clamp(180px,28vw,270px)] rounded-lg overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-105 z-10">
                    <Image
                      src={music.image}
                      alt={music.title}
                      fill
                      className="object-cover"
                    />

                    {/* Ambient light */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                  </div>

                  {/* VINYL */}
                  {music.hasVinyl && (
                    <div
                      className={`
                        absolute inset-0 z-0
                        transition-transform duration-700 ease-out
                        ${
                          isMobile
                            ? isActive
                              ? "translate-x-[55%]"
                              : "translate-x-0"
                            : "group-hover:translate-x-[55%]"
                        }
                      `}
                    >
                      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl">
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

                {/* TITLE */}
                <h3 className="font-semibold text-black text-[clamp(1.1rem,2.2vw,1.5rem)] text-center">
                  {music.title}
                </h3>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button className="group flex items-center gap-2 text-gray-600 hover:text-black transition">
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
          </button>
        </div>
      </div>
    </section>
  );
};

export default MusicCards;
