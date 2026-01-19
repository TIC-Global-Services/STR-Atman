"use client";
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { getInstagramEmbedUrl } from '@/utils/instagram';

const InstagramSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Instagram posts with actual post URLs - update these with latest posts
  const instagramPosts = [
    {
      id: 1,
      image: "/simbusong1.jpg",
      alt: "STR Instagram Post 1",
      hasOverlay: true,
      caption: "Latest update from STR",
      likes: "125K",
      postUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/",
      embedUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/embed"
    },
    {
      id: 2,
      image: "/simbusong2.png",
      alt: "STR Instagram Post 2",
      hasOverlay: true,
      caption: "New music coming soon! 🎵",
      likes: "89K",
      postUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/",
      embedUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/embed"
    },
    {
      id: 3,
      image: "/simbusong3.jpg",
      alt: "STR Instagram Post 3",
      hasOverlay: true,
      caption: "Thank you for all the love ❤️",
      likes: "156K",
      postUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/",
      embedUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/embed"
    },
    {
      id: 4,
      image: "/simbusong4.jpg",
      alt: "STR Instagram Post 4",
      hasOverlay: true,
      caption: "Studio vibes 🎬",
      likes: "92K",
      postUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/",
      embedUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/embed"
    },
    {
      id: 5,
      image: "/simbusong5.png",
      alt: "STR Instagram Post 5",
      hasOverlay: true,
      caption: "Grateful for this journey",
      likes: "134K",
      postUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/",
      embedUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/embed"
    },
    {
      id: 6,
      image: "/simbusong6.jpg",
      alt: "STR Instagram Post 6",
      hasOverlay: true,
      caption: "Family time is the best time",
      likes: "201K",
      postUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/",
      embedUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/embed"
    }
  ];

  // Initialize to middle set to avoid setState in effect
  const [currentIndex, setCurrentIndex] = useState(instagramPosts.length);

  // Create extended array with duplicates for seamless loop
  const extendedPosts = [...instagramPosts, ...instagramPosts, ...instagramPosts];

  // Auto-scroll functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isInView) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          // Reset to beginning of second set when reaching end
          if (nextIndex >= instagramPosts.length * 2) {
            // Use setTimeout to reset after transition completes
            setTimeout(() => {
              setCurrentIndex(instagramPosts.length);
            }, 50); // Small delay to allow transition to complete
            return nextIndex;
          }
          return nextIndex;
        });
      }, 4000); // Slightly slower for Instagram posts
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isInView, instagramPosts.length]);

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

  const handlePostClick = (postUrl: string) => {
    window.open(postUrl, '_blank', 'noopener,noreferrer');
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
            In The Spotlight
          </h2>
          
          <p className="text-[#717580] text-[20px] leading-tight max-w-4xl mx-auto">
            From press meets and exclusive interviews to audio launch speeches and stage moments, explore STR’s most iconic talks, media interactions and public appearances all curated in one place.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full overflow-hidden" style={{ height: '450px' }}>
          <div className="relative w-full h-full">
            {/* Render all extended posts */}
            {extendedPosts.map((post, index) => {
              const style = getCardStyle(index);
              const position = getCardPosition(index);
              const isCenter = position === 0;
              
              return (
                <div 
                  key={`${post.id}-${Math.floor(index / instagramPosts.length)}`}
                  className="relative overflow-hidden rounded-2xl group cursor-pointer"
                  style={style}
                  onClick={() => handlePostClick(post.postUrl)}
                >
                  <Image
                    src={post.image}
                    alt={post.alt}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Instagram Post Overlay on hover */}
                  {post.hasOverlay && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                      {/* Instagram icon at top */}
                      <div className="flex justify-end">
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          className="text-white"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="2"/>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      
                      {/* Caption and likes at bottom */}
                      <div className="space-y-2">
                        <p className="text-white text-sm line-clamp-2">
                          {post.caption}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            <span className="text-white text-sm font-medium">{post.likes}</span>
                          </div>
                          <span className="text-white/80 text-sm">View Post →</span>
                        </div>
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
            onClick={() => setCurrentIndex(prev => (prev + 1) % instagramPosts.length)}
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

export default InstagramSection;