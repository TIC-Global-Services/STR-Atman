"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Journey = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const stats = statsRef.current;

    if (!section || !image || !stats) return;

    // Create GSAP context for cleanup
    const ctx = gsap.context(() => {
      // Animate background image moving up on scroll - triggered by stats visibility
      gsap.to(image, {
        y: -200,
        ease: "none",
        scrollTrigger: {
          trigger: stats,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        }
      });

      // Animate stats section moving up on scroll - triggered when stats enter viewport
      gsap.to(stats, {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: stats,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          ref={imageRef}
          src="/journeybg.jpg"
          alt="Journey background"
          className="absolute object-cover opacity-100"
          style={{
            width: '926px',
            height: '1158px',
            top: '140px',
            left: '257px',
            transform: 'rotate(0deg)'
          }}
          onError={(e) => {
            console.error('Failed to load journeybg.jpg:', e);
          }}
          onLoad={() => {
            console.log('journeybg.jpg loaded successfully');
          }}
        />
      </div>
      
      {/* Fallback background */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black -z-10"></div>
      
      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Title (Static) */}
        <div className="flex-1 flex items-center justify-start pl-4">
          <div className="text-left">
            <h1 className="text-[120px] lg:text-7xl xl:text-8xl font-normal font-halfre text-white leading-tight">
              A Closer<br />
              Look<br />
              At The<br />
              <span className="text-green-400">Journey</span>
            </h1>
          </div>
        </div>
        
        {/* Right Side - Stats (Animated) */}
        <div ref={statsRef} className="flex-1 flex items-center justify-center pr-4 translate-y-16">
          <div className="space-y-16">
            {/* 1987 */}
            <div className="text-right">
              <div className="text-[110px] lg:text-6xl font-normal text-green-400 mb-2">1987</div>
              <p className="text-white text-lg lg:text-xl max-w-sm">
                The Year He Stepped Into Cinema As A Child Artist
              </p>
            </div>
            
            {/* 25+ */}
            <div className="text-right">
              <div className="text-5xl lg:text-6xl font-normal text-green-400 mb-2">25+</div>
              <p className="text-white text-lg lg:text-xl max-w-sm">
                Years Of Experience Across Acting, Direction, Music, And Writing
              </p>
            </div>
            
            {/* 40+ */}
            <div className="text-right">
              <div className="text-5xl lg:text-6xl font-normal text-green-400 mb-2">40+</div>
              <p className="text-white text-lg lg:text-xl max-w-sm">
                Films That Shaped Pop Culture And Sparked Conversation
              </p>
            </div>
            
            {/* 100+ */}
            <div className="text-right">
              <div className="text-5xl lg:text-6xl font-normal text-green-400 mb-2">100+</div>
              <p className="text-white text-lg lg:text-xl max-w-sm">
                Songs Written, Sung, Or Influenced By His Creative Vision
              </p>
            </div>
            
            {/* 1 */}
            <div className="text-right">
              <div className="text-5xl lg:text-6xl font-normal text-green-400 mb-2">1</div>
              <p className="text-white text-lg lg:text-xl max-w-sm">
                An Evolving Legacy Defined By Reinvention, Resilience, And Raw Honesty
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;