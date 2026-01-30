"use client";
import Image from 'next/image';
import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const ShareMomentSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cards = [
    { id: 1, image: "/update1.jpg", alt: "Fan moment 1" },
    { id: 2, image: "/update2.jpg", alt: "Featured fan moment" },
    { id: 3, image: "/update3.jpg", alt: "Fan moment 3" },
    { id: 4, image: "/update4.jpg", alt: "Fan moment 4" },
    { id: 5, image: "/membership/sharedmoment1.png", alt: "Fan moment 5" },
    { id: 6, image: "/membership/sharedmoment2.png", alt: "Fan moment 6" },
    { id: 7, image: "/membership/sharedmoment3.png", alt: "Fan moment 7" }
  ];

  const [currentIndex, setCurrentIndex] = useState(cards.length);
  const extendedCards = [...cards, ...cards, ...cards];

  // Handle Resize for responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= cards.length * 2) {
        setTimeout(() => setCurrentIndex(cards.length), 50);
        return next;
      }
      return next;
    });
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev - 1;
      if (next < cards.length) {
        setTimeout(() => setCurrentIndex(cards.length * 2 - 1), 50);
        return next;
      }
      return next;
    });
  }, [cards.length]);

  // Auto-scroll
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInView) {
      interval = setInterval(handleNext, 4000);
    }
    return () => clearInterval(interval);
  }, [isInView, handleNext]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getCardStyle = (cardIndex: number) => {
    const position = cardIndex - currentIndex;
    const isCenter = position === 0;
    const isVisible = Math.abs(position) <= (isMobile ? 1 : 2);

    // Responsive sizing logic
    const baseWidth = isMobile ? 85 : 40; // width in % or vw
    const centerScale = isMobile ? 1 : 1.2;
    
    // Spacing calculation
    const offsetMultiplier = isMobile ? 90 : 45;
    const xTransform = position * offsetMultiplier;

    return {
      width: isMobile ? '80vw' : isCenter ? '600px' : '480px',
      height: isMobile ? '50vh' : isCenter ? '380px' : '300px',
      opacity: isVisible ? (isCenter ? 1 : 0.4) : 0,
      transform: `translateX(calc(-50% + ${xTransform}vw)) scale(${isCenter ? 1 : 0.85}) translateY(${isCenter ? 0 : isMobile ? 20 : 40}px)`,
      zIndex: isCenter ? 20 : 10 - Math.abs(position),
      transition: 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'absolute' as const,
      left: '50%',
      pointerEvents: isCenter ? 'auto' as const : 'none' as const,
    };
  };

  return (
    <section ref={sectionRef} className="relative w-full bg-white py-12 md:py-24 overflow-hidden">
      <div className="w-full">
        <h2 
          className="text-black text-center mb-10 md:mb-16 px-6"
          style={{ 
            fontFamily: 'Halfre, sans-serif',
            fontSize: 'clamp(32px, 6vw, 64px)',
            lineHeight: '1',
          }}
        >
          Share your moment
        </h2>

        {/* Carousel Container */}
        <div className="relative w-full" style={{ height: isMobile ? '55vh' : '430px' }}>
          {extendedCards.map((card, index) => (
            <div 
              key={`${card.id}-${index}`}
              className="relative overflow-hidden rounded-2xl shadow-xl"
              style={getCardStyle(index)}
            >
              <Image
                src={card.image}
                alt={card.alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 80vw, 600px"
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-6">
          <button 
            onClick={handlePrev}
            className="group flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full cursor-pointer border border-black hover:bg-primary hover:border-primary transition-all duration-300"
            aria-label="Previous slide"
          >
            <svg 
              className="w-5 h-5 text-primary group-hover:text-black transition-colors" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            onClick={handleNext}
            className="group flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full cursor-pointer border border-black hover:bg-primary hover:border-primary transition-all duration-300"
            aria-label="Next slide"
          >
            <svg 
              className="w-5 h-5 text-primary group-hover:text-black transition-colors" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShareMomentSection;