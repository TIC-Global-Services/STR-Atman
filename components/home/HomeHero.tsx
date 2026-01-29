"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ContourBackground from "../reuseable/ContourBackground";
import gsap from "gsap";
import FluidStrCanvas from "./FluidStrCanvas";

const HomeHero = () => {
  const contourRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const fluidRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null); // for full-page blur

  const [showStaticStr, setShowStaticStr] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;

      gsap.to(contourRef.current, {
        x: x * 5,
        y: y * 15,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // "atman" toggle detector
  useEffect(() => {
    let typed = "";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      typed += e.key.toLowerCase();
      if (typed.length > 5) typed = typed.slice(-5);

      if (typed === "atman") {
        if (!isTransitioning) {
          setShowStaticStr((prev) => !prev);
          typed = "";
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTransitioning]);

  // GSAP animation timeline for smooth transitions + full blur
  useEffect(() => {
    if (!contentRef.current) return;

    setIsTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false),
    });

    // Start full-page blur
    tl.to(
      contentRef.current,
      {
        filter: "blur(10px)",
        duration: 1.0,
        ease: "power2.in",
      },
      0,
    );

    if (showStaticStr) {
      // fluid → static image
      tl.to(
        fluidRef.current,
        {
          opacity: 0,
          duration: 1.5,
          ease: "power2.out",
        },
        0.4,
      )
        .fromTo(
          imageRef.current,
          { opacity: 0, scale: 1.07, filter: "blur(14px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 3.2,
            ease: "power3.inOut",
          },
          0.7,
        )
        .to(
          contentRef.current,
          {
            filter: "blur(0px)",
            duration: 1.6,
            ease: "power3.out",
          },
          "-=2.4",
        );
    } else {
      // static image → fluid
      tl.to(
        imageRef.current,
        {
          opacity: 0,
          scale: 1.04,
          filter: "blur(10px)",
          duration: 2.4,
          ease: "power3.in",
        },
        0.3,
      )
        .fromTo(
          fluidRef.current,
          { opacity: 0, scale: 1.03 },
          {
            opacity: 1,
            scale: 1,
            duration: 2.8,
            ease: "power3.out",
          },
          1.1,
        )
        .to(
          contentRef.current,
          {
            filter: "blur(0px)",
            duration: 1.7,
            ease: "power3.out",
          },
          "-=2.2",
        );
    }
  }, [showStaticStr]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Blurrable content wrapper */}
      <div ref={contentRef} className="absolute inset-0">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Home/Hero.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/20 z-10" />

        {/* MASKED CONTOUR */}
        <div
          ref={contourRef}
          className="
            absolute inset-0 z-20
            flex items-center justify-center
            mask-[url(/logo/logo.png)]
            mask-contain mask-no-repeat mask-center
            bg-white
            pointer-events-none
          "
        >
          <ContourBackground
            lineColor="rgba(0,0,0)"
            speed={0.06}
            resolution={150}
            levels={5}
            lineWidth={1.4}
          />
        </div>

        {/* LIGHTING */}
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 opacity-5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 opacity-5 rounded-full blur-3xl" />
        </div>

        {/* Scroll hint */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-1000 ${
            showStaticStr ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
            <span className="text-black text-sm font-medium">
              Scroll to Explore
            </span>
          </div>
        </div>
      </div>

      {/* STR content layer – always on top, not affected by parent blur */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {/* Fluid canvas – default state */}
        <div ref={fluidRef} className="absolute inset-0 w-full h-full">
          <FluidStrCanvas />
        </div>

        {/* Static full-screen image */}
        <div
          ref={imageRef}
          className="absolute inset-0 w-full h-full opacity-0"
        >
          <Image
            src="/STR/str-group-new.png"
            alt="STR Group"
            fill
            className="object-cover"
            priority
            quality={92}
          />
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">        
          <div className="bg-white/20 backdrop-blur-sm rounded-full py-2">          
            <span className="text-black text-sm font-medium">
              Scroll to Explore
            </span>        
          </div>      
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
