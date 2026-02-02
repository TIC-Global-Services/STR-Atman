"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Journey = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const title = titleRef.current;
    const statsInner = statsInnerRef.current;

    if (!section || !image || !title || !statsInner) return;

    const mm = gsap.matchMedia();

    /* =========================
       DESKTOP
    ========================= */
    mm.add("(min-width: 1024px)", () => {
      // 🔒 Sticky / pinned title
      ScrollTrigger.create({
        trigger: section,
        start: "top top+=100",
        end: "bottom bottom",
        pin: title,
        pinSpacing: false, // absolute → no layout spacing needed
      });

      // 🌄 Background image parallax
      gsap.to(image, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // 📊 Stats parallax (inner only)
      gsap.to(statsInner, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });
    });

    /* =========================
       MOBILE
    ========================= */
    mm.add("(max-width: 1023px)", () => {
      gsap.to(image, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(statsInner, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen md:min-h-[200vh] overflow-hidden bg-black"
    >
      {/* IMAGE BASE LAYER */}
      <div className="absolute inset-0 z-0 flex justify-center items-end">
        <img
          ref={imageRef}
          src="/journeybg.jpg"
          alt="Journey background"
          className="w-full h-[80vh] md:h-full object-cover md:object-contain"
        />
      </div>

      {/* TITLE — ABSOLUTE OVERLAY */}
      <div
        ref={titleRef}
        className="absolute top-12 md:top-32 left-6 md:left-12 z-20"
      >
        <h1
          className="
            text-white font-halfre leading-[1]
            text-[clamp(28px,6vw,120px)]
            max-w-[14ch] md:max-w-[10ch]
          "
        >
          A Closer Look At The{" "}
          <span className="text-green-400">Journey</span>
        </h1>
      </div>

      {/* STATS — ABSOLUTE OVERLAY */}
      <div className="absolute right-12 bottom-0 md:bottom-32 z-20">
        <div
          ref={statsInnerRef}
          className="w-[80vw] sm:w-[60vw] md:w-full md:max-w-sm space-y-6 md:space-y-10"
        >
          {[
            ["1987", "The Year He Stepped Into Cinema As A Child Artist"],
            ["25+", "Years Of Experience Across Acting, Direction, Music, And Writing"],
            ["40+", "Films That Shaped Pop Culture And Sparked Conversation"],
            ["100+", "Songs Written, Sung, Or Influenced By His Creative Vision"],
            ["1", "An Evolving Legacy Defined By Reinvention, Resilience, And Raw Honesty"],
          ].map(([num, text]) => (
            <div key={num}>
              <div className="text-green-400 text-[clamp(28px,5vw,64px)]">
                {num}
              </div>
              <p className="text-white text-sm sm:text-base lg:text-lg">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journey;
