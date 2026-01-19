"use client";
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

const NewsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  const newsCards = [
    {
      id: 1,
      image: "/newsroom/news1.png",
      alt: "STR News 1"
    },
    {
      id: 2,
      image: "/newsroom/news2.png",
      alt: "STR Announces Upcoming Project",
      hasOverlay: true,
      title: "STR Announces Upcoming Project",
      cta: "View →"
    },
    {
      id: 3,
      image: "/newsroom/news3.png",
      alt: "STR News 3"
    }
  ];

  // Initialize to middle set to avoid setState in effect
  const [currentIndex, setCurrentIndex] = useState(newsCards.length);

  // Create extended array with duplicates for seamless loop
  const extendedCards = [...newsCards, ...newsCards, ...newsCards];

  // Auto-scroll functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isInView) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          // Reset to beginning of second set when reaching end
          if (nextIndex >= newsCards.length * 2) {
            // Use setTimeout to reset after transition completes
            setTimeout(() => {
              setCurrentIndex(newsCards.length);
            }, 50); // Small delay to allow transition to complete
            return nextIndex;
          }
          return nextIndex;
        });
      }, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isInView, newsCards.length]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  // Calculate card position relative to center
  const getCardPosition = (cardIndex: number) => {
    const centerIndex = currentIndex;
    const diff = cardIndex - centerIndex;
    return diff;
  };

  // Get card style based on its position relative to center
  const getCardStyle = (cardIndex: number) => {
    const position = getCardPosition(cardIndex);
    const isCenter = position === 0;
    const isVisible = Math.abs(position) <= 1; // Only show cards within 1 position of center
    
    // Calculate spacing: card width + 40px gap
    const centerCardWidth = 624;
    const sideCardWidth = 500;
    const gap = 40;
    
    // For positioning, use the width of the card that will be in that position
    let spacing;
    if (position > 0) {
      // Moving right: center card width/2 + gap + side card width/2
      spacing = (centerCardWidth / 2) + gap + (sideCardWidth / 2);
    } else if (position < 0) {
      // Moving left: center card width/2 + gap + side card width/2
      spacing = -((centerCardWidth / 2) + gap + (sideCardWidth / 2));
    } else {
      spacing = 0;
    }

    return {
      width: isCenter ? '624px' : '500px',
      height: isCenter ? '394px' : '314px',
      opacity: isVisible ? (isCenter ? 1 : 0.8) : 0,
      transform: `scale(${isCenter ? 1 : 0.95}) translateX(${spacing}px) translateY(${isCenter ? 0 : 40}px)`,
      zIndex: isCenter ? 10 : 5,
      transition: 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'absolute' as const,
      left: '50%',
      marginLeft: isCenter ? '-312px' : '-250px' // Center each card based on its width
    };
  };

  return (
    <section ref={sectionRef} className="relative w-full bg-white py-20 light">
      <div className="w-full">
        {/* Title and Description */}
        <div className="text-center mb-16 px-6 lg:px-12">
          <h2 
            className="text-black mb-6"
            style={{ 
              fontFamily: 'Halfre, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(36px, 5vw, 40px)',
              lineHeight: '1.1',
              letterSpacing: '0%'
            }}
          >
            Official news & announcements
          </h2>
          
          <p className="text-[#717580] text-[20px] leading-tight max-w-3xl mx-auto">
            This space features verified updates, media coverage, and official announcements related to Silambarasan TR. From film launches to major milestones, every update here reflects accurate and authenticated information.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full overflow-hidden" style={{ height: '450px' }}>
          <div className="relative w-full h-full">
            {/* Render all extended cards */}
            {extendedCards.map((card, index) => {
              const style = getCardStyle(index);
              const position = getCardPosition(index);
              const isCenter = position === 0;
              
              return (
                <div 
                  key={`${card.id}-${Math.floor(index / newsCards.length)}`}
                  className="relative overflow-hidden rounded-2xl group cursor-pointer"
                  style={style}
                >
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Overlay Text for featured card on hover */}
                  {card.hasOverlay && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white text-lg font-medium">
                          {card.title}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {card.cta}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows - Positioned on the right */}
        <div className="flex justify-end pr-6 lg:pr-12 mt-8 space-x-4">
          <button 
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button 
            onClick={() => setCurrentIndex(prev => (prev + 1) % newsCards.length)}
            className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;