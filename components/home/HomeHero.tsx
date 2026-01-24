"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import ContourBackground from "../reuseable/ContourBackground";
import gsap from "gsap";
import FluidStrCanvas from "./FluidStrCanvas";

const HomeHero = () => {
  const contourRef = useRef<HTMLDivElement>(null);

  const strImages =[
    "/Home/Str-01.png",
    "/Home/Str-02.png",
    "/Home/Str-03.png",
    "/Home/Str-05.png",
    "/Home/Str-06.png",
    "/Home/Str-07.png",
  ]

  /* ===============================
     MOUSE PARALLAX
  =============================== */
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
        className="absolute inset-0 z-30 w-full h-screen"
      >
       <FluidStrCanvas />
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
