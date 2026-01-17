"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Waves from './Waves';

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#B0BD91] py-16 px-8 lg:px-16 overflow-hidden">
      {/* Decorative Border at Top */}
      <div className="absolute top-0 left-0 w-full h-auto z-0 pointer-events-none">
        <svg 
          className="w-full h-auto" 
          viewBox="0 0 1401 670" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ height: '100px' }}
        >
          <path 
            opacity="0.3" 
            d="M1 79V78C1 64.7452 11.7452 54 25 54H26H410.897C414.902 54 418.843 52.9978 422.362 51.0846L510.95 2.91536C514.468 1.00223 518.409 0 522.414 0H880.892C884.836 0 888.72 0.97216 892.199 2.83047L982.701 51.1695C986.18 53.0278 990.063 54 994.008 54H1016H1376H1377C1390.25 54 1401 64.7452 1401 78V609V610C1401 623.255 1390.25 634 1377 634H1104.14C1097.66 634 1091.45 636.622 1086.93 641.27L1066.07 662.73C1061.55 667.378 1055.34 670 1048.86 670H420.5H373.345C366.742 670 360.431 667.279 355.897 662.479L336.103 641.521C331.569 636.721 325.258 634 318.655 634H26H24.1079C11.4291 634 0.937414 624.138 0.153781 611.483L0 609L1 352.665V79Z" 
            fill="url(#pattern0_401_216)" 
            fillOpacity="0.55"
          />
          <defs>
            <pattern id="pattern0_401_216" patternContentUnits="objectBoundingBox" width="1" height="1">
              <rect width="100%" height="100%" fill="rgba(0,0,0,0.1)" />
            </pattern>
          </defs>
        </svg>
      </div>
      
      {/* Waves Background Effect */}
      <Waves
        lineColor="rgba(0, 0, 0, 0.15)"
        backgroundColor="transparent"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={25}
        xGap={12}
        yGap={35}
      />
      
      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          
          {/* Left Section - Pages */}
          <div className="text-left">
            <h3 className="text-black text-sm font-semibold mb-6">Pages</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/" className="text-black hover:text-gray-700 transition-colors text-base">
                Home
              </Link>
              <Link href="/about" className="text-black hover:text-gray-700 transition-colors text-base">
                About
              </Link>
              <Link href="/press-desk" className="text-black hover:text-gray-700 transition-colors text-base">
                Press Desk
              </Link>
              <Link href="/music-journey" className="text-black hover:text-gray-700 transition-colors text-base">
                Music Journey
              </Link>
              <Link href="/membership" className="text-black hover:text-gray-700 transition-colors text-base">
                Membership
              </Link>
              <Link href="/store" className="text-green-500 hover:text-green-600 transition-colors text-base font-semibold">
                Merch Store
              </Link>
            </nav>
          </div>

          {/* Center Section - Image and Text */}
          <div className="flex flex-col items-center justify-center text-center relative">
            {/* Yellow Signature */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-16 z-30">
              <Image
                src="/strsign.png"
                alt="STR Signature"
                fill
                className="object-contain"
                style={{ filter: 'brightness(0) saturate(100%) invert(88%) sepia(85%) saturate(1352%) hue-rotate(360deg) brightness(104%) contrast(101%)' }}
              />
            </div>

            {/* Container for Image and Overlaid Text */}
            <div className="relative w-[350px] h-[440px] lg:w-[466px] lg:h-[583px] mt-12">
              {/* Person Image */}
              <div className="relative w-full h-full z-100">
                <div className="absolute top-[80px] left-0 right-0 bottom-0">
                  <Image
                    src="/footersimbu.png"
                    alt="STR"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              
              {/* Overlaid Text */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] z-20 pt-8">
                <h2 className="text-5xl lg:text-[80px] font-bold leading-tight">
                  <span className="text-white">STRONGER</span>{' '}
                  <span className="text-black">THAN</span>
                  <br />
                  <span className="text-black">YESTERDAY.</span>
                </h2>
              </div>
            </div>
          </div>

          {/* Right Section - Follow */}
          <div className="text-right">
            <h3 className="text-black text-sm font-semibold mb-6">Follow on</h3>
            <nav className="flex flex-col gap-3 items-end">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 transition-colors text-base"
              >
                Instagram
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 transition-colors text-base"
              >
                X
              </a>
              <a 
                href="https://spotify.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 transition-colors text-base"
              >
                Spotify
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="mt-16 flex flex-col lg:flex-row justify-between items-center text-sm text-black gap-4">
          <p>© 2026 Silambarasan TR. All rights reserved</p>
          <p>Designed & Developed by TIC Global Services</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
