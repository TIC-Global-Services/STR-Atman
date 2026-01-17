"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="relative w-full overflow-hidden px-4 md:px-8 lg:px-[50px] pb-8 lg:pb-12">
      <div className="relative w-full max-w-[1340px] h-[350px] md:h-[450px] lg:h-[504px] overflow-hidden rounded-[20px] mx-auto">
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
        <div className="relative h-full flex items-center px-6 md:px-12 lg:px-16">
          <div className="flex flex-col items-start justify-center w-full">
            {/* Text */}
            <h2 className="text-white text-2xl md:text-3xl lg:text-[34px] font-normal leading-tight mb-[80px] max-w-full lg:max-w-5xl">
              Get a first look at upcoming films, trailers, and music<br />
              that mark the next phase of the journey.
            </h2>
            
            {/* Button and Signature Container */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-start w-full gap-8 lg:gap-16">
              {/* Button on the left */}
              <Link 
                href="/updates"
                className="inline-block bg-green-500 hover:bg-green-600 text-black font-bold text-sm lg:text-base py-2.5 lg:py-3 px-6 lg:px-8 rounded-md transition-colors duration-200"
              >
                View Updates
              </Link>
              
              {/* Signature centered */}
              <div className="relative w-full max-w-[420px] h-[150px] md:h-[170px] lg:h-[184px] z-50 mx-auto lg:mx-20">
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
      </div>
    </section>
  );
};

export default CTASection;
