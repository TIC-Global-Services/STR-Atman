"use client";

import React from "react";
import Image from "next/image";
import ModelViewer from "../reuseable/ModelViewer";

const AboutHero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Image
          src="/aboutbg.png"
          alt="About background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Fallback gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 z-0 pointer-events-none" />

      {/* 3D MODEL — MUST RECEIVE MOUSE */}
      <div className="absolute inset-0 z-30 pointer-events-auto">
        <ModelViewer
          modelUrl="/glb/3d_logo.glb"
          modelScale={5}
          cameraPosition={[0, 3, 8]}
          cameraFov={35}
          environmentPreset="studio"
          enableControls={false}
          useStage
        />
      </div>

      {/* Foreground STR logo — ignore mouse */}
      <div className="absolute inset-0 flex items-center justify-center z-40 translate-y-12 pointer-events-none">
        <div className="relative w-full md:w-[50%]">
          <Image
            src="/aboutstr.png"
            alt="STR Logo"
            width={800}
            height={400}
            className="w-full scale-150 md:scale-100"
            priority
          />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[35vh] z-50 bg-gradient-to-t from-black via-black/70 to-transparent" />
    </div>
  );
};

export default AboutHero;
