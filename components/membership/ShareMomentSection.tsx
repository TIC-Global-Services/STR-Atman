"use client";
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

const ShareMomentSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  const cards = [
    {
      id: 1,
      image: "/update1.jpg",
      alt: "Fan moment 1"
    },
    {
      id: 2,
      image: "/update2.jpg",
      alt: "Featured fan moment",
    },
    {
      id: 3,
      image: "/update3.jpg",
      alt: "Fan moment 3"
    },
    {
      id: 4,
      image: "/update4.jpg",
      alt: "Fan moment 4"
    },
    {
      id: 5,
      image: "/membership/sharedmoment1.png",
      alt: "Fan moment 5"
    },
    {
      id: 6,
      image: "/membership/sharedmoment2.png",
      alt: "Fan moment 6"
    },
    {
      id: 7,
      image: "/membership/sharedmoment3.png",
      alt: "Fan moment 7"
    }
  ];

  // Initialize to middle set to avoid setState in effect
  const [currentIndex, setCurrentIndex] = useState(cards.length);

  // Create extended array with duplicates for seamless loop
  const extendedCards = [...cards, ...cards, ...cards];

  // Auto-scroll functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isInView) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          // Reset to beginning of second set when reaching end
          if (nextIndex >= cards.length * 2) {
            // Use setTimeout to reset after transition completes
            setTimeout(() => {
              setCurrentIndex(cards.length);
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
  }, [isInView, cards.length]);

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
        {/* Title */}
        <h2 
          className="text-black text-center mb-12 px-6 lg:px-12"
          style={{ 
            fontFamily: 'Halfre, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(36px, 5vw, 60px)',
            lineHeight: '1.1',
            letterSpacing: '0%'
          }}
        >
          Share your moment
        </h2>

        {/* Carousel Container */}
        <div className="relative w-full overflow-hidden" style={{ height: '450px' }}>
          <div className="relative w-full h-full">
            {/* Render all extended cards */}
            {extendedCards.map((card, index) => {
              const style = getCardStyle(index);
              
              return (
                <div 
                  key={`${card.id}-${Math.floor(index / cards.length)}`}
                  className="relative overflow-hidden rounded-[8px]"
                  style={style}
                >
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShareMomentSection;