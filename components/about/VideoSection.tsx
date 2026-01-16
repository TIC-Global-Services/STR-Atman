"use client";
import React from 'react';

const VideoSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-black">
      {/* Full Width Video Container */}
      <div className="relative w-full h-screen">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/pGd_s2Db9Fo?autoplay=1&mute=1&loop=1&playlist=pGd_s2Db9Fo&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&playsinline=1"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen={false}
          loading="lazy"
          style={{
            pointerEvents: 'none'
          }}
        ></iframe>
        
        {/* Overlay to prevent interaction (optional) */}
        <div className="absolute inset-0 pointer-events-none"></div>
      </div>
    </section>
  );
};

export default VideoSection;