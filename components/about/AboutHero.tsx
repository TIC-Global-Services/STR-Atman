"use client";
import React from "react";
import Image from "next/image";

const AboutHero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image - Person Photo (Bottom Layer) */}
      <div className="absolute inset-0 z-10">
        <Image
          src="/aboutbg.png"
          alt="About background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          onError={(e) => {
            console.error("Failed to load aboutbg.png:", e);
          }}
          onLoad={() => {
            console.log("aboutbg.png loaded successfully");
          }}
        />
      </div>

      {/* Fallback background in case image doesn't load */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 z-0"></div>

      {/* STR Logo Background (Middle Layer - behind aboutstr) */}
      <div className="absolute top-[3%] md:inset-0 flex items-center justify-center z-30 translate-y-8">
        <Image
          src="/logo/logo.png"
          alt="STR Logo Background"
          width={1200}
          height={400}
          className=" object-contain scale-110 w-full"
          priority
          onError={(e) => {
            console.error("Failed to load strlogo.png:", e);
          }}
        />
      </div>

      {/* Large STR Logo Foreground (Top Layer - aboutstr) */}
      <div className="absolute inset-0 flex items-center justify-center z-40 translate-y-12">
        <div className="relative w-full md:w-[50%]">
          <Image
            src="/aboutstr.png"
            alt="STR Logo"
            width={800}
            height={400}
            className=" object-cover md:object-contain w-full scale-150 md:scale-100"
            priority
          />
        </div>
      </div>

      {/* Bottom black → transparent overlay */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[35vh] z-50 bg-gradient-to-t from-black via-black/70 to-transparent" />
    </div>
  );
};

export default AboutHero;
