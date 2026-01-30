"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const InstagramSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  /* ==============================
     DATA
  ============================== */
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

  /* ==============================
     INFINITE SETUP
  ============================== */
  const [currentIndex, setCurrentIndex] = useState(instagramPosts.length);
  const extendedPosts = [
    ...instagramPosts,
    ...instagramPosts,
    ...instagramPosts,
  ];

  /* ==============================
     RESPONSIVE LAYOUT STATE (FIX)
  ============================== */
  const [layout, setLayout] = useState<any>(null);

  useEffect(() => {
    const calculateLayout = () => {
      const isMobile = window.innerWidth < 768;

      setLayout({
        centerWidth: isMobile ? 280 : 624,
        sideWidth: isMobile ? 240 : 500,
        centerHeight: isMobile ? 180 : 394,
        sideHeight: isMobile ? 160 : 314,
        gap: isMobile ? 16 : 40,
        sideOffsetY: isMobile ? 20 : 40,
        sideScale: isMobile ? 0.97 : 0.95,
      });
    };

    calculateLayout();
    window.addEventListener("resize", calculateLayout);

    return () => window.removeEventListener("resize", calculateLayout);
  }, []);

  /* ==============================
     INTERSECTION OBSERVER
  ============================== */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ==============================
     AUTO SCROLL
  ============================== */
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;

        if (next >= instagramPosts.length * 2) {
          setTimeout(() => setCurrentIndex(instagramPosts.length), 50);
          return next;
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isInView, instagramPosts.length]);

  /* ==============================
     CARD STYLE
  ============================== */
  const getCardStyle = (index: number) => {
    if (!layout) return { opacity: 0 };

    const position = index - currentIndex;
    const isCenter = position === 0;
    const isVisible = Math.abs(position) <= 1;

    const {
      centerWidth,
      sideWidth,
      centerHeight,
      sideHeight,
      gap,
      sideOffsetY,
      sideScale,
    } = layout;

    let translateX = 0;

    if (position > 0) {
      translateX = centerWidth / 2 + gap + sideWidth / 2;
    } else if (position < 0) {
      translateX = -(centerWidth / 2 + gap + sideWidth / 2);
    }

    return {
      position: "absolute" as const,
      left: "50%",
      width: isCenter ? `${centerWidth}px` : `${sideWidth}px`,
      height: isCenter ? `${centerHeight}px` : `${sideHeight}px`,
      marginLeft: isCenter ? `-${centerWidth / 2}px` : `-${sideWidth / 2}px`,
      opacity: isVisible ? (isCenter ? 1 : 0.85) : 0,
      transform: `
        translateX(${translateX}px)
        translateY(${isCenter ? 0 : sideOffsetY}px)
        scale(${isCenter ? 1 : sideScale})
      `,
      zIndex: isCenter ? 10 : 5,
      transition: "all 700ms cubic-bezier(0.4,0,0.2,1)",
    };
  };

  return (
    <section ref={sectionRef} className="relative w-full py-20">
      {/* TITLE */}
      <div className="text-center mb-16 px-6 lg:px-12">
        <h2 className="text-black text-2xl md:text-5xl mb-6">
          In The Spotlight
        </h2>
        <p className="text-[#717580] text-base md:text-[20px] max-w-4xl mx-auto">
          From press meets and exclusive interviews to iconic Instagram moments.
        </p>
      </div>

      {/* CAROUSEL */}
      <div className="relative w-full overflow-hidden h-[200px] md:h-[450px]">
        <div className="relative w-full">
          {layout &&
            extendedPosts.map((post, index) => (
              <div
                key={`${post.id}-${index}`}
                className="relative overflow-hidden rounded-2xl group cursor-pointer"
                style={getCardStyle(index)}
                onClick={() => window.open(post.postUrl, "_blank")}
              >
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  className="object-cover"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition">
                  <p className="text-white text-sm mb-2 line-clamp-2">
                    {post.caption}
                  </p>
                  <div className="flex justify-between text-white text-sm">
                    <span>❤️ {post.likes}</span>
                    <span className="opacity-80">View →</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ARROWS */}
      <div className="flex justify-end pr-6 lg:pr-12 mt-8 space-x-4">
        <button
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="w-12 h-12 cursor-pointer rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0de65a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => prev + 1)}
          className="w-12 h-12 cursor-pointer rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0de65a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default InstagramSection;
