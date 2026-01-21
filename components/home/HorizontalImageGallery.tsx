"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DecayCard from "../reuseable/DecayCard";

gsap.registerPlugin(ScrollTrigger);

const gallery = [
  { img: "/membership/memberherobg.jpg", content: "Visit to maleysia" },
  { img: "/membership/community.jpg" },
  { img: "/membership/sharedmoment3.png", content: "Visit to maleysia" },
  { img: "/newsroom/news2.png" },
  { img: "/membership/memberherobg.jpg" },
  { img: "/membership/community.jpg", content: "Visit to maleysia" },
];
const HorizontalImageGallery = () => {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const gradientRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gradientRef.current || !pinRef.current) return;

    gsap.to(gradientRef.current, {
      opacity: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: pinRef.current,
        start: "50% center", 
        end: "bottom top",
        scrub: 1.5,
      },
    });
  }, []);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;

    if (!pin || !track) return;

    const totalScroll = track.scrollWidth - window.innerWidth + 200;

    const ctx = gsap.context(() => {
      // Start offscreen
      gsap.set(track, {
        x: window.innerWidth,
      });

      const horizontalTween = gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        paused: true,
      });

      ScrollTrigger.create({
        trigger: pin,
        start: "top bottom", // section enters viewport
        end: "top top", // until it hits top
        scrub: true,
        onUpdate: (self) => {
          horizontalTween.progress(self.progress * 0.25);
        },
      });

      ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: () => `+=${track.scrollWidth}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          horizontalTween.progress(0.25 + self.progress * 0.75);
        },
      });
    }, pin);

    return () => ctx.revert();
  }, []);

  return (
    
    <div ref={pinRef} className="h-screen w-full overflow-hidden py-10">
      <div
        ref={gradientRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "#5E7C1A",
          opacity: 0,
        }}
      />

      <div ref={trackRef} className="flex items-center gap-32 px-32 h-full ">
        {gallery.map((item, index) => {
          const isCenter = index % 3 === 1;

          return (
            <div
              key={index}
              className={`flex-shrink-0
                  ${index % 2 === 0 ? "-translate-y-20" : "translate-y-20"}
                `}
            >
              <DecayCard
                width={isCenter ? 420 : 300}
                height={isCenter ? 520 : 400}
                image={item.img}
              >
                {item.content && <h1>{item.content}</h1>}
              </DecayCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalImageGallery;
