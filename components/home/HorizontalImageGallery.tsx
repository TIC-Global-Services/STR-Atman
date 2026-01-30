"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DecayCard from "../reuseable/DecayCard";

gsap.registerPlugin(ScrollTrigger);

const gallery = [
  {
    img: "/membership/memberherobg.jpg",
    title: "Lorem Ipsum",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis erat erat.",
  },
  {
    img: "/membership/community.jpg",
    title: "Lorem Ipsum",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis erat erat.",
  },
  {
    img: "/membership/sharedmoment3.png",
    title: "Lorem Ipsum",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis erat erat.",
  },
  {
    img: "/newsroom/news2.png",
    title: "Lorem Ipsum",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis erat erat.",
  },
  {
    img: "/membership/memberherobg.jpg",
    title: "Lorem Ipsum",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis erat erat.",
  },
  {
    img: "/membership/community.jpg",
    title: "Lorem Ipsum",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis erat erat.",
  },
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
                width={isCenter ? 400 : 280}
                height={isCenter ? 500 : 380}
                image={item.img}
              >
                <div className=" max-w-xs pt-6">
                  {item.title && <h1>{item.title}</h1>}
                  {item.desc && <p className=" text-sm ">{item.desc}</p>}
                </div>
              </DecayCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalImageGallery;
