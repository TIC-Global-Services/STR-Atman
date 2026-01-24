"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VelocityScroll } from "../reuseable/VelocityScroll";
import BlurText from "../reuseable/BlurText";

gsap.registerPlugin(ScrollTrigger);

const STRAbout = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);

  const [showText, setShowText] = useState(false);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=240%",
          scrub: true,
          pin: true,
          anticipatePin: 1,

          // Control text lifecycle
          onUpdate: (self) => {
            // Show text only AFTER image expansion + bg change
            if (self.progress > 0.45) {
              setShowText(true);
            } else {
              setShowText(false); // reset on scroll back
            }
          },
        },
      });

      /* Image expand */
      tl.to(imageCardRef.current, {
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
        duration: 4,
      });

      /* Image bg change */
      tl.to(imageCardRef.current, {
        backgroundColor: "#ffffff",
        duration: 1,
      });

      tl.to({}, { duration: 2.2 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden light"
    >
      {/* Title */}
      <h2 className="absolute top-[20%] left-1/2 -translate-x-1/2 text-2xl 2xl:text-3xl font-medium text-black z-30">
        Silambarasan TR
      </h2>

      {/* Velocity background */}
      <VelocityScroll
        numRows={2}
        defaultVelocity={2}
        texts={["I DID WHAT I BELIEVED IN", "THE REST IS HISTORY"]}
        className="absolute inset-0 flex flex-col justify-center uppercase text-black pointer-events-none"
      />

      {/* Image card */}
      <div
        ref={imageCardRef}
        className="
          fixed top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          aspect-9/16 md:aspect-video
          w-[200px] md:w-[35dvw]
          bg-black overflow-hidden z-40
        "
      >
        <Image
          src="/STR/str-group-new.png"
          alt="STR Group"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* About Text (Mount / Unmount) */}
      {showText && (
        <div
          className="
            fixed top-[25%] md:top-[10%]
            left-1/2 -translate-x-1/2
            w-[calc(100vw-2rem)] md:max-w-4xl
            px-4 md:px-10
            text-center
            z-50 pointer-events-none
          "
        >
          <BlurText
            text="I'm Silambarasan TR someone who grew up on film sets, learned life through cinema, and evolved with every role I played. From being a child artist to leading films, my journey has never been about playing it safe. It's been about honesty, growth, and staying true to who I am."
            animateBy="words"
            delay={1}
            direction="top"
            className="text-[clamp(14px,2vw,24px)] text-black leading-tight"
          />
        </div>
      )}

      {/* Foreground */}
      <div className="relative z-0 flex flex-col items-center justify-end min-h-screen pb-20">
        <Image src="/strsign.png" alt="Signature" width={100} height={100} />
      </div>
    </section>
  );
};

export default STRAbout;
