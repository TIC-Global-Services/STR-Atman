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
  const contentRef = useRef<HTMLDivElement>(null); // ← for full-page blur

  const [showStaticStr, setShowStaticStr] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Mouse parallax
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

  // "atman" toggle
  useEffect(() => {
    let typed = "";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      typed += e.key.toLowerCase();
      if (typed.length > 5) typed = typed.slice(-5);

      if (typed === "atman") {
        setShowStaticStr((prev) => !prev);
        typed = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Animate transitions + full blur during change
  useEffect(() => {
    if (!contentRef.current) return;

    setIsTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false),
    });

    if (showStaticStr) {
      // fluid → image
      tl
        .to(contentRef.current, {
          filter: "blur(12px)",
          duration: 1.2,
          ease: "power2.in",
        }, 0)
        .fromTo(
          imageRef.current,
          { opacity: 0, scale: 1.08, filter: "blur(14px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 3.2,
            ease: "power3.inOut",
          },
          0.4
        )
        .to(fluidRef.current || {}, { opacity: 0, duration: 1.6 }, 0.4)
        .to(contentRef.current, {
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power3.out",
        }, "-=1.8");
    } else {
      // image → fluid
      tl
        .to(contentRef.current, {
          filter: "blur(12px)",
          duration: 1.2,
          ease: "power2.in",
        }, 0)
        .to(imageRef.current, {
          opacity: 0,
          scale: 1.04,
          filter: "blur(8px)",
          duration: 2.4,
          ease: "power3.inOut",
        }, 0)
        .fromTo(
          fluidRef.current || {},
          { opacity: 0 },
          {
            opacity: 1,
            duration: 2.8,
            ease: "power3.out",
          },
          0.9
        )
        .to(contentRef.current, {
          filter: "blur(0px)",
          duration: 1.6,
          ease: "power3.out",
        }, "-=2.0");
    }
  }, [showStaticStr]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Main content wrapper — we blur this */}
      <div ref={contentRef} className="absolute inset-0 transition-filter duration-1000">
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
            resolution={8}
            levels={8}
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
          className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-800 ${
            showStaticStr ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
            <span className="text-black text-sm font-medium">Scroll to Explore</span>
          </div>
        </div>
      </div>

      {/* STR layer — always on top, not blurred */}
      <div className="absolute inset-0 z-30 w-full h-full pointer-events-none">
        {/* Fluid (default) */}
        <div
          ref={fluidRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: showStaticStr ? 0 : 1 }}
        >
          <FluidStrCanvas />
        </div>

        {/* Static full-screen image */}
        <div
          ref={imageRef}
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
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
      </div>
    </div>
  );
};

export default HomeHero;