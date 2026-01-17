"use client";
import Image from 'next/image';
import { useEffect, useRef } from 'react';

const filmImages = [
  '/simbusong1.jpg',
  '/simbusong2.png',
  '/simbusong3.jpg',
  '/simbusong4.jpg',
  '/simbusong5.png',
  '/simbusong6.jpg',
];

const FilmReelSet = ({ images, startIndex = 0 }: { images: string[], startIndex?: number }) => {
  const positions = [39.12, 298.4, 557.68];
  
  return (
    <div style={{ display: 'flex', gap: '0', lineHeight: '0', fontSize: '0' }}>
      {/* First Film Reel - 3 images */}
      <div className="relative" style={{ width: '844.8px', height: '528px', flexShrink: 0, display: 'block' }}>
        <Image
          src="/filmreel.png"
          alt="Film reel"
          width={844.8}
          height={528}
          style={{ display: 'block', width: '844.8px', height: '528px', margin: 0, padding: 0 }}
        />
        {images.slice(0, 3).map((img, index) => (
          <div
            key={`reel1-${startIndex}-${index}`}
            className="absolute"
            style={{
              width: '248px',
              height: '162px',
              top: '184.24px',
              left: `${positions[index]}px`,
            }}
          >
            <Image
              src={img}
              alt={`Moment ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Second Film Reel - 3 images */}
      <div className="relative" style={{ width: '844.8px', height: '528px', flexShrink: 0, display: 'block' }}>
        <Image
          src="/filmreel.png"
          alt="Film reel"
          width={844.8}
          height={528}
          style={{ display: 'block', width: '844.8px', height: '528px', margin: 0, padding: 0 }}
        />
        {images.slice(3, 6).map((img, index) => (
          <div
            key={`reel2-${startIndex}-${index}`}
            className="absolute"
            style={{
              width: '248px',
              height: '162px',
              top: '184.24px',
              left: `${positions[index]}px`,
            }}
          >
            <Image
              src={img}
              alt={`Moment ${index + 4}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const FilmStrip = () => {
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topScroll = topScrollRef.current;
    const bottomScroll = bottomScrollRef.current;
    
    if (!topScroll || !bottomScroll) return;

    let topAnimationId: number;
    let bottomAnimationId: number;
    let topScrollPosition = 0;
    let bottomScrollPosition = 0;

    const scrollSpeed = 0.5; // pixels per frame
    const reelSetWidth = 844.8 * 2; // width of one complete set (2 reels)

    const animateTop = () => {
      topScrollPosition += scrollSpeed;
      
      // Reset when we've scrolled past 2 sets (half of the 4 duplicates)
      if (topScrollPosition >= reelSetWidth * 2) {
        topScrollPosition = 0;
      }
      
      if (topScroll) {
        topScroll.style.transform = `translateX(-${topScrollPosition}px)`;
      }
      
      topAnimationId = requestAnimationFrame(animateTop);
    };

    const animateBottom = () => {
      bottomScrollPosition -= scrollSpeed; // scroll in opposite direction
      
      // Reset when we've scrolled past 2 sets in reverse
      if (bottomScrollPosition <= -reelSetWidth * 2) {
        bottomScrollPosition = 0;
      }
      
      if (bottomScroll) {
        bottomScroll.style.transform = `translateX(${bottomScrollPosition}px)`;
      }
      
      bottomAnimationId = requestAnimationFrame(animateBottom);
    };

    topAnimationId = requestAnimationFrame(animateTop);
    bottomAnimationId = requestAnimationFrame(animateBottom);

    return () => {
      cancelAnimationFrame(topAnimationId);
      cancelAnimationFrame(bottomAnimationId);
    };
  }, []);

  return (
    <section className="relative w-full bg-[#E8E8E8] py-20 overflow-hidden">
      {/* Top Film Strip - Infinite Scroll */}
      <div className="relative w-full mb-16 overflow-hidden">
        <div 
          ref={topScrollRef}
          className="relative"
          style={{ display: 'flex', gap: '0', lineHeight: '0', fontSize: '0', willChange: 'transform' }}
        >
          {/* Duplicate the film reel set 4 times for seamless loop */}
          {[0, 1, 2, 3].map((setIndex) => (
            <FilmReelSet key={`top-set-${setIndex}`} images={filmImages} startIndex={setIndex} />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto text-center px-8 mb-16">
        <h2 className="text-5xl font-bold text-black mb-6">
          Moments that resonated
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          This isn&apos;t just a list of songs, it&apos;s a collection of moments that defined STR&apos;s musical journey. 
          From mass anthems that shook theatres to melodies{' '}
          <span className="text-gray-500">
            that hit the heart, every track carries a memory. Relive the phases, the vibes, and the iconic 
            highs that made Silambarasan TR a true musical force.
          </span>
        </p>
      </div>

      {/* Bottom Film Strip - Infinite Scroll (Reverse Direction) */}
      <div className="relative w-full overflow-hidden">
        <div 
          ref={bottomScrollRef}
          className="relative"
          style={{ display: 'flex', gap: '0', lineHeight: '0', fontSize: '0', willChange: 'transform' }}
        >
          {/* Duplicate the film reel set 4 times for seamless loop */}
          {[0, 1, 2, 3].map((setIndex) => (
            <FilmReelSet key={`bottom-set-${setIndex}`} images={[...filmImages].reverse()} startIndex={setIndex} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FilmStrip;
