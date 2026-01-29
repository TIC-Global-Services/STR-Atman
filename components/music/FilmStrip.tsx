"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import BlurText from "../reuseable/BlurText";

/* ------------------------------------------------------------------ */
/* DATA */
/* ------------------------------------------------------------------ */

const filmImages = [
  "/simbusong1.jpg",
  "/simbusong4.jpg",
  "/simbusong3.jpg",
  "/simbusong2.png",
  "/simbusong6.jpg",
  "/simbusong5.png",
];

/* ------------------------------------------------------------------ */
/* FILM REEL SET */
/* ------------------------------------------------------------------ */

const FilmReelSet = ({ images }: { images: string[] }) => {
  return (
    <div className="flex shrink-0 w-[50dvw]">
      {[0, 1].map((reelIndex) => (
        <div
          key={reelIndex}
          className="relative w-[80%] md:w-1/2 shrink-0 aspect-[16/10]"
        >
          {/* Film Reel Background */}
          <Image
            src="/musical/filmreel.png"
            alt="Film reel"
            fill
            className="object-cover"
            priority
          />

          {/* Frames */}
          <div className="absolute inset-0 grid grid-cols-6  py-[8%] w-dvw">
            {images
              .slice(reelIndex * 3, reelIndex * 3 + 3)
              .map((img, index) => (
                <div
                  key={`${reelIndex}-${index}`}
                  className="relative w-full h-full border-x-2 overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`Moment ${index + 1}`}
                    fill
                    className="object-cover object-right w-full h-full"
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* FILM STRIP */
/* ------------------------------------------------------------------ */

const FilmStrip = () => {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!top || !bottom) return;

    let topX = 0;
    let bottomX = 0;
    const speed = 0.8; // Adjust speed as needed

    const animate = () => {
      // Top Strip (Moving Left)
      topX += speed;
      // We reset when the first HALF of the content has scrolled past
      // Since we duplicate the content, scrollWidth / 2 is the exact midpoint
      if (topX >= top.scrollWidth / 2) {
        topX = 0;
      }
      top.style.transform = `translate3d(-${topX}px, 0, 0)`;

      // Bottom Strip (Moving Right)
      bottomX += speed;
      if (bottomX >= bottom.scrollWidth / 2) {
        bottomX = 0;
      }
      // For right movement, we start at -midpoint and move toward 0
      bottom.style.transform = `translate3d(${-bottom.scrollWidth / 2 + bottomX}px, 0, 0)`;

      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative w-full overflow-hidden py-[8vh] pb-32 space-y-[8vh]">
      {/* TOP STRIP */}
      <div className="relative w-full overflow-hidden">
        {/* Added 'w-max' to ensure the flex container doesn't shrink */}
        <div ref={topRef} className="flex w-max will-change-transform">
          {/* Render the set twice to create the loop */}
          {[0, 1].map((set) => (
            <div key={`set-top-${set}`} className="flex">
              {[0, 1, 2].map((i) => (
                <FilmReelSet key={`top-${i}`} images={filmImages} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center px-6">
        <BlurText
          text=" Where emotion finds a voice"
          delay={60}
          animateBy="words"
          direction="top"
          className="text-[clamp(2rem,5vw,3rem)] font-medium mb-4"
        />
        <BlurText
          text="This isn&apos;t just a list of songs — it&apos;s a collection of
          moments that defined STR&apos;s musical journey. From mass anthems
          that shook theatres to melodies hit the heart, every track carries a
          memory. Relive the phases, the vibes, and the iconic highs that made
          Silambarasan TR a true musical force."
          delay={5}
          animateBy="words"
          direction="top"
          className=" text-gray-700 text-[clamp(1rem,2vw,1.125rem)] tracking-tight"
        />
      </div>

      {/* BOTTOM STRIP */}
      <div className="relative w-full overflow-hidden">
        <div ref={bottomRef} className="flex w-max will-change-transform">
          {[0, 1].map((set) => (
            <div key={`set-bottom-${set}`} className="flex">
              {[0, 1, 2].map((i) => (
                <FilmReelSet
                  key={`bottom-${i}`}
                  images={[...filmImages].reverse()}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FilmStrip;
