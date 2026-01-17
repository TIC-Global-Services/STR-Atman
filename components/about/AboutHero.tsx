"use client";
import React from 'react';
import Image from 'next/image';

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
            console.error('Failed to load aboutbg.png:', e);
          }}
          onLoad={() => {
            console.log('aboutbg.png loaded successfully');
          }}
        />
      </div>
      
      {/* Fallback background in case image doesn't load */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 z-0"></div>
      
      {/* Bottom gradient overlay with blur for smooth transition */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-black via-black/70 to-transparent z-50 backdrop-blur-md"></div> */}
      
      {/* Optional: Subtle dark overlay for better contrast */}
      <div className="absolute inset-0 bg-transparent bg-opacity-20 z-15"></div>
      
      {/* STR Logo Background (Middle Layer - behind aboutstr) */}
      <div className="absolute inset-0 flex items-center justify-center z-30 translate-y-8">
        <Image
          src="/strlogo.png"
          alt="STR Logo Background"
          width={1200}
          height={400}
          className=" object-contain scale-150"
          priority
          onError={(e) => {
            console.error('Failed to load strlogo.png:', e);
          }}
        />
      </div>
      
      {/* Large STR Logo Foreground (Top Layer - aboutstr) */}
      <div className="absolute inset-0 flex items-center justify-center z-40 translate-y-12">
        <Image
          src="/aboutstr.png"
          alt="STR Logo"
          width={800}
          height={400}
          className="opacity- object-contain"
          priority
          onError={(e) => {
            console.error('Failed to load aboutstr.png:', e);
          }}
        />
      </div>
      
      {/* Optional: Add some subtle lighting effects */}
      <div className="absolute top-0 left-0 w-full h-full z-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 opacity-5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default AboutHero;