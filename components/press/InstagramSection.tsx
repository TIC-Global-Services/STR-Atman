"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const InstagramSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  const instagramPosts = [
    {
      id: 1,
      image: "/simbusong1.jpg",
      alt: "STR Instagram Post 1",
      caption: "Latest update from STR",
      likes: "125K",
      postUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/",
    },
    {
      id: 2,
      image: "/simbusong2.png",
      alt: "STR Instagram Post 2",
      caption: "New music coming soon! 🎵",
      likes: "89K",
      postUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/",
    },
    {
      id: 3,
      image: "/simbusong3.jpg",
      alt: "STR Instagram Post 3",
      caption: "Thank you for all the love ❤️",
      likes: "156K",
      postUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/",
    },
    {
      id: 4,
      image: "/simbusong4.jpg",
      alt: "STR Instagram Post 4",
      caption: "Studio vibes 🎬",
      likes: "92K",
      postUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/",
    },
    {
      id: 5,
      image: "/simbusong5.png",
      alt: "STR Instagram Post 5",
      caption: "Grateful for this journey",
      likes: "134K",
      postUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/",
    },
    {
      id: 6,
      image: "/simbusong6.jpg",
      alt: "STR Instagram Post 6",
      caption: "Family time is the best time",
      likes: "201K",
      postUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/",
    },
  ];

  /* ============================================================
     Infinite carousel setup
  ============================================================ */
  const [currentIndex, setCurrentIndex] = useState(instagramPosts.length);
  const extendedPosts = [...instagramPosts, ...instagramPosts, ...instagramPosts];

  /* ============================================================
     Auto scroll
  ============================================================ */
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= instagramPosts.length * 2) {
          return instagramPosts.length;
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isInView, instagramPosts.length]);

  /* ============================================================
     Intersection Observer
  ============================================================ */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ============================================================
     Positioning logic
  ============================================================ */
  const getCardStyle = (index: number) => {
    const position = index - currentIndex;
    const isCenter = position === 0;
    const isVisible = Math.abs(position) <= 1;

    const centerWidth = 624;
    const sideWidth = 500;
    const gap = 40;

    let x = 0;
    if (position > 0) {
      x = centerWidth / 2 + gap + sideWidth / 2;
    }
    if (position < 0) {
      x = -(centerWidth / 2 + gap + sideWidth / 2);
    }

    return {
      position: "absolute" as const,
      left: "50%",
      width: isCenter ? "624px" : "500px",
      height: isCenter ? "394px" : "314px",
      marginLeft: isCenter ? "-312px" : "-250px",
      opacity: isVisible ? (isCenter ? 1 : 0.8) : 0,
      zIndex: isCenter ? 10 : 5,
      transform: `translateX(${x}px) translateY(${isCenter ? 0 : 40}px) scale(${
        isCenter ? 1 : 0.95
      })`,
      transition: "all 800ms cubic-bezier(0.4, 0, 0.2, 1)",
    };
  };

  /* ============================================================
     Arrow controls (FIXED)
  ============================================================ */
  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const next = prev - 1;
      if (next < instagramPosts.length) {
        return instagramPosts.length * 2 - 1;
      }
      return next;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= instagramPosts.length * 2) {
        return instagramPosts.length;
      }
      return next;
    });
  };

  return (
    <section ref={sectionRef} className="relative w-full py-20 light">
      {/* Title */}
      <div className="text-center mb-16 px-6 lg:px-12">
        <h2
          className="text-black"
          style={{
            fontFamily: "Halfre, sans-serif",
            fontWeight: 400,
            fontSize: "clamp(36px, 5vw, 40px)",
          }}
        >
          In The Spotlight
        </h2>

        <p className="text-[#717580] text-[20px] max-w-4xl mx-auto">
          From press meets and exclusive interviews to audio launch speeches and
          stage moments, explore STR’s most iconic talks and appearances.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative w-full overflow-hidden" style={{ height: 450 }}>
        {extendedPosts.map((post, index) => (
          <div
            key={`${post.id}-${index}`}
            className="rounded-2xl overflow-hidden cursor-pointer group"
            style={getCardStyle(index)}
            onClick={() => window.open(post.postUrl, "_blank")}
          >
            <Image src={post.image} alt={post.alt} fill className="object-cover" />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition">
              <p className="text-white text-sm mb-2 line-clamp-2">
                {post.caption}
              </p>
              <div className="flex items-center justify-between text-white text-sm">
                <span>❤️ {post.likes}</span>
                <span className="opacity-80">View Post →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <div className="flex justify-end pr-6 lg:pr-12 mt-8 space-x-4">
          <button 
            onClick={handlePrev}
            className="w-12 h-12 cursor-pointer rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0de65a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button 
            onClick={handleNext}
            className="w-12 h-12 cursor-pointer rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0de65a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
    </section>
  );
};

export default InstagramSection;
