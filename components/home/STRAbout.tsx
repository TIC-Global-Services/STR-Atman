"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VelocityScroll } from "../reuseable/VelocityScroll";

gsap.registerPlugin(ScrollTrigger);

const STRAbout = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const aboutTextRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      let charSpans: NodeListOf<HTMLSpanElement> | null = null;

      if (aboutTextRef.current) {
        const text = aboutTextRef.current.textContent || "";

        aboutTextRef.current.innerHTML = text
          .split(" ")
          .map((word) => {
            const letters = word
              .split("")
              .map(
                (char) =>
                  `<span class="char text-[#7F7F7F] inline-block">${char}</span>`,
              )
              .join("");

            return `<span class="word inline-flex whitespace-nowrap mr-1">${letters}</span>`;
          })
          .join("");

        charSpans = aboutTextRef.current.querySelectorAll(".char");
      }

      /* ------------------------------
       MAIN SCROLL TIMELINE
    -------------------------------- */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%",
          scrub: true,
          pin: true,
        },
      });

      /* PHASE 1 — Expand image (takes MOST of the scroll) */
      tl.to(imageCardRef.current, {
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
        duration: 4,
        ease: "none",
      });

      /* PHASE 2 — Change image background */
      tl.to(imageCardRef.current, {
        backgroundColor: "#ffffff",
        duration: 1,
        ease: "none",
      });

      /* PHASE 3 — Make text fully visible (INSTANT) */
      tl.to(
        aboutTextRef.current,
        {
          opacity: 1,
          visibility: "visible",
          duration: 0.01,
          ease: "none",
        },
        ">",
      );

      /* PHASE 4 — letter color reveal */
      if (charSpans) {
        tl.to(
          charSpans,
          {
            color: "#000000",
            stagger: 0.08,
            duration: 1.2,
            ease: "none",
          },
          ">",
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-white light"
    >
      <h2 className="text-2xl 2xl:text-3xl font-medium text-black absolute top-[20%] left-1/2 -translate-x-1/2 ">
        Silambarasan TR
      </h2>

      {/* ---------- Infinite Text (Background) ---------- */}
      <VelocityScroll
        numRows={2}
        defaultVelocity={2}
        texts={["I DID WHAT I BELIEVED IN", "THE REST IS HISTORY"]}
        className="absolute inset-0 flex flex-col justify-center uppercase text-black pointer-events-none"
      />

      {/* ---------- Image Card ---------- */}
      <div
        ref={imageCardRef}
        className="fixed top-1/2 left-1/2 
         aspect-9/16 md:aspect-video w-[200px] md:w-[35dvw] 
        -translate-x-1/2 -translate-y-1/2
        bg-black  overflow-hidden z-40"
      >
        <Image
          src="/STR/str-group.png"
          alt="STR Group"
          fill
          priority
          className="object-cover "
        />
      </div>

      {/* ---------- About Text ---------- */}
      <p
        ref={aboutTextRef}
        className="
    fixed top-[25%] md:top-[15%]
    left-1/2 -translate-x-1/2

    w-[calc(100vw-2rem)] md:w-max
    max-w-full md:max-w-4xl

    px-4 md:px-10
    text-center
    text-[clamp(14px,2vw,24px)]

    text-[#7F7F7F]
    z-50 pointer-events-none
    whitespace-normal
    opacity-0
  "
      >
        I'm Silambarasan TR someone who grew up on film sets, learned life 
        through cinema, and evolved with every role I played. From being a child
         artist to leading films, my journey has never been about playing it
        safe. It's been about honesty, growth, and staying true to who I am.
      </p>

      {/* ---------- Foreground Content ---------- */}
      <div className="relative z-0 flex flex-col items-center justify-end min-h-screen pb-20">
        <Image src="/strsign.png" alt="Signature" width={100} height={100} />
      </div>
    </section>
  );
};

export default STRAbout;
