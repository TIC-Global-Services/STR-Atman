"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import ContourBackground from "../reuseable/ContourBackground";
import gsap from "gsap";

const HomeHero = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const contourRef = useRef<HTMLDivElement>(null);
  const strRef = useRef<HTMLDivElement>(null);

  /* ===============================
     MOUSE PARALLAX
  =============================== */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;

      gsap.to(bgRef.current, {
        x: x * 20,
        y: y * 20,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to(contourRef.current, {
        x: x * 35,
        y: y * 35,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to(strRef.current, {
        x: x * 50,
        y: y * 20,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
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

      {/* STR LOGO */}
      <div
        ref={strRef}
        className="absolute inset-0 z-30 flex items-center justify-center translate-y-12"
      >
        <Image
          src="/aboutstr.png"
          alt="STR Logo"
          width={400}
          height={400}
          className="object-contain scale-150"
          priority
        />
      </div>

      {/* LIGHTING */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 opacity-5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default HomeHero;
