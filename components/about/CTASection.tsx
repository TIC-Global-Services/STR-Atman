"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="relative w-full overflow-hidden" style={{ padding: '50px' }}>
      <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden rounded-2xl">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/strcta.png"
            alt="CTA Background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-transparent bg-opacity-50"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-8">
          {/* Left Side - Text and Button */}
          <div className="flex-1 max-w-2xl">
            <h2 className="text-white text-3xl lg:text-4xl font-normal leading-tight mb-8">
              Get a first look at upcoming films, trailers, and music<br />
              that mark the next phase of the journey.
            </h2>
            
            <Link 
              href="/updates"
              className="inline-block bg-green-500 hover:bg-green-600 text-black font-bold text-sm lg:text-base py-3 px-8 rounded-md transition-colors duration-200"
            >
              View Updates
            </Link>
          </div>

          {/* Right Side - Signature */}
          <div className="relative w-[300px] lg:w-[400px] h-[120px] lg:h-[150px]">
            <Image
              src="/strsign.png"
              alt="STR Signature"
              fill
              className="object-contain"
              style={{ filter: 'brightness(0) saturate(100%) invert(88%) sepia(85%) saturate(1352%) hue-rotate(360deg) brightness(104%) contrast(101%)' }}
            />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
