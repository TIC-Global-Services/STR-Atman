"use client";

import ContainerLayout from "@/layout/ContainerLayout";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Stories = () => {
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const gridImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const viewMoreRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
          y: 100,
          opacity: 0,
        });
      }

      // Left image animation
      if (leftImageRef.current) {
        gsap.from(leftImageRef.current, {
          scrollTrigger: {
            trigger: leftImageRef.current,
            start: "top 70%",
            end: "top 20%",
            scrub: 1,
          },
          scale: 0.85,
          opacity: 0,
        });
      }

      // Text paragraphs animation
      textRefs.current.forEach((text, i) => {
        if (text) {
          gsap.from(text, {
            scrollTrigger: {
              trigger: text,
              start: "top 85%",
              end: "top 70%",
              scrub: 1,
            },
            y: 60,
            opacity: 0,
          });
        }
      });

      // Main image parallax effect
      if (mainImageRef.current) {
        gsap.to(mainImageRef.current, {
          scrollTrigger: {
            trigger: mainImageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
          y: -100,
          ease: "none",
        });
      }

      // Caption animation
      if (captionRef.current) {
        gsap.from(captionRef.current, {
          scrollTrigger: {
            trigger: captionRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
          y: 50,
          opacity: 0,
        });
      }

      // Grid images with physics-based parallax
      gridImagesRef.current.forEach((img, i) => {
        if (img) {
          const direction = i % 2 === 0 ? 1 : -1;

          // Scroll-based parallax
          gsap.to(img, {
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
            y: direction * 10,
            x: direction * 10,
            ease: "none",
          });

          // Hover animation
          
        }
      });

      // View More link animation
      if (viewMoreRef.current) {
        gsap.from(viewMoreRef.current, {
          scrollTrigger: {
            trigger: viewMoreRef.current,
            start: "top 90%",
            end: "top 60%",
            scrub: 1,
          },
          x: -40,
          opacity: 0,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen w-full md:pt-40">
      <ContainerLayout className="py-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-[10%] justify-between">
          {/* Left Column */}
          <div
            className="w-full lg:max-w-[30%] space-y-6 py-10 lg:py-20"
            ref={leftColRef}
          >
            <h1
              className="text-4xl md:text-6xl font-medium leading-tight"
              ref={headingRef}
            >
              More Stories. <br /> More Truth.
            </h1>

            <div className="space-y-6">
              <div ref={leftImageRef} className="overflow-hidden ">
                <Image
                  src={"/Stories/story2.png"}
                  alt={"StR story pic"}
                  width={500}
                  height={500}
                  className="object-cover object-center w-full h-auto"
                />
              </div>
              <div className="space-y-10 text-[#575757] text-xl md:text-2xl">
                <p ref={(el) => { textRefs.current[0] = el; }}>
                  He is often seen as inspirational because his journey is
                  rooted in resilience and self reinvention. Growing up in the
                  public eye and facing intense scrutiny, he chose to pause,
                  reflect, and rebuild himself physically, mentally, and
                  creatively.
                </p>
                <p ref={(el) => { textRefs.current[1] = el; }}>
                  Instead of chasing constant validation, he focused on
                  discipline, self awareness, and growth, returning with renewed
                  clarity and purpose. His story shows that true strength lies
                  not in perfection, but in the courage to reset, take
                  responsibility, and come back stronger and more grounded.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div
            className="w-full lg:max-w-[70%] flex flex-col gap-12 lg:gap-[5%]"
            ref={rightColRef}
          >
            <div className="w-full ">
              <div
                ref={mainImageRef}
                className="overflow-hidden  will-change-transform"
              >
                <Image
                  src={"/Stories/story1.png"}
                  alt={"StR story pic"}
                  width={1200}
                  height={675}
                  className="aspect-video object-cover object-right w-full"
                />
              </div>
              <p
                className="text-lg md:text-2xl text-[#575757]"
                ref={captionRef}
              >
                Cinema is an ongoing conversation, between emotions, moments, and the people who experience them. Every role, every frame, and every pause adds to a journey that doesn’t end when the screen fades.
              </p>
            </div>

            <div className="w-full  mx-auto flex flex-col items-start justify-start">
              <div className="flex items-center justify-center gap-6 md:gap-10 w-full mb-6">
                <div
                  ref={(el) => { gridImagesRef.current[0] = el; }}
                  className="overflow-hidden  cursor-pointer will-change-transform"
                >
                  <Image
                    src={"/Stories/story3.png"}
                    alt={"StR story pic"}
                    width={600}
                    height={600}
                    className="aspect-square object-cover"
                  />
                </div>
                <div
                  ref={(el) => { gridImagesRef.current[1] = el; }}
                  className="overflow-hidden  cursor-pointer will-change-transform"
                >
                  <Image
                    src={"/Stories/story4.png"}
                    alt={"StR story pic"}
                    width={600}
                    height={600}
                    className="aspect-square object-cover"
                  />
                </div>
              </div>
              <Link
                href={"/"}
                ref={viewMoreRef}
                className="text-xl font-medium hover:underline transition-all inline-flex items-center gap-2 group text-[#505050]"
              >
                Know More
                
              </Link>
            </div>
          </div>
        </div>
      </ContainerLayout>
    </div>
  );
};

export default Stories;