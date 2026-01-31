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
  const statsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    const stats = statsRef.current;
    const section = sectionRef.current;
    const title = titleRef.current;

    if (!image || !stats || !section || !title) return;

    const mm = gsap.matchMedia();

    // Desktop
    mm.add("(min-width: 1024px)", () => {
      gsap.to(image, {
        y: -40,
        scrollTrigger: {
          trigger: stats,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true,
        },
      });

      gsap.to(stats, {
        y: -220,
        scrollTrigger: {
          trigger: stats,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true,
        },
      });

      // 🔒 PIN TITLE
      ScrollTrigger.create({
        trigger: section,
        start: "top top+=50",
        end: "bottom bottom",
        pin: title,
        pinSpacing: false,
      });
    });

    // Tablet & Mobile
    mm.add("(max-width: 1023px)", () => {
      gsap.to(image, {
        y: -60,
        scrollTrigger: {
          trigger: stats,
          start: "top 85%",
          end: "bottom 30%",
          scrub: true,
        },
      });

      gsap.to(stats, {
        y: -20,
        scrollTrigger: {
          trigger: stats,
          start: "top 85%",
          end: "bottom 30%",
          scrub: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative  w-full overflow-hidden bg-black
                 px-4 sm:px-6 lg:px-12"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 flex justify-center bg-cover w-full h-full items-end">
        <img
          ref={imageRef}
          src="/journeybg.jpg"
          alt="Journey background"
          className=" object-cover  md:object-contain w-full h-[80dvh] md:h-auto md:w-1/2"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-10 lg:flex-row pt-32">
        {/* TITLE */}
        <div
          ref={titleRef}
          className="md:flex-1 flex items-start justify-start"
        >
          <h1
            className="
              text-white font-halfre
              leading-[1]
              text-left
              text-[clamp(28px,6vw,120px)]
              max-w-[14ch]
              md:max-w-[10ch]
            "
          >
            A Closer Look At The{" "}
            <span className="text-green-400">Journey</span>
          </h1>
        </div>

        {/* STATS */}
        <div
          ref={statsRef}
          className=" flex items-end md:justify-end "
        >
          <div className="w-[80%] md:w-full md:max-w-sm space-y-4 md:space-y-10">
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
      </div>
    </section>
  );
};

export default Journey;
