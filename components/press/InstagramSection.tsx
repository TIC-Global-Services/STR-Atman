"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

const InstagramSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  /* ==============================
     DATA (MANUAL META – REQUIRED)
     Later this can come from API
  ============================== */
  const instagramPosts = [
    {
      id: 1,
      postUrl: "https://www.instagram.com/p/DRrdGrTkXGA/",
      likes: "754K",
      caption: "As per my fans request ❤️",
    },
    {
      id: 2,
      postUrl: "https://www.instagram.com/reel/DRG3XXXkdt0/",
      likes: "2.5M",
      caption: "❤️❤️",
    },
    {
      id: 3,
      postUrl: "https://www.instagram.com/p/DQ1YlwOkSNJ/",
      likes: "2.1M",
      caption: "Thank you all for the endless love and support ❤️",
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
     RESPONSIVE LAYOUT
  ============================== */
  const [layout, setLayout] = useState<any>(null);

  useEffect(() => {
    const calculateLayout = () => {
      const isMobile = window.innerWidth < 768;

      setLayout({
        centerWidth: isMobile ? 300 : 420,
        sideWidth: isMobile ? 260 : 360,
        centerHeight: isMobile ? 460 : 540,
        sideHeight: isMobile ? 420 : 500,
        gap: isMobile ? 16 : 40,
        sideOffsetY: isMobile ? 20 : 40,
        sideScale: isMobile ? 0.96 : 0.94,
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
    }, 4500);

    return () => clearInterval(interval);
  }, [isInView, instagramPosts.length]);

  /* ==============================
     LOAD INSTAGRAM EMBED SCRIPT
  ============================== */
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!(window as any).instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      (window as any).instgrm.Embeds.process();
    }
  }, []);

  /* ==============================
     REPROCESS EMBEDS
  ============================== */
  useEffect(() => {
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, [currentIndex]);

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
    if (position > 0) translateX = centerWidth / 2 + gap + sideWidth / 2;
    if (position < 0) translateX = -(centerWidth / 2 + gap + sideWidth / 2);

    return {
      position: "absolute" as const,
      left: "50%",
      width: isCenter ? centerWidth : sideWidth,
      height: isCenter ? centerHeight : sideHeight,
      marginLeft: isCenter ? -centerWidth / 2 : -sideWidth / 2,
      opacity: isVisible ? 1 : 0,
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
          Instagram Highlights
        </h2>
        <p className="text-[#717580] text-base md:text-[20px] max-w-4xl mx-auto">
          A curated glimpse into STR’s Instagram — official posts and reels.
        </p>
      </div>

      {/* CAROUSEL */}
      <div className="relative w-full overflow-hidden h-[520px] md:h-[620px]">
        <div className="relative w-full h-full">
          {layout &&
            extendedPosts.map((post, index) => (
              <div
                key={`${post.id}-${index}`}
                className="relative rounded-2xl overflow-hidden bg-white shadow-xl group"
                style={getCardStyle(index)}
              >
                {/* EMBED */}
                <div
                  className={`absolute inset-0 ${
                    index === currentIndex
                      ? "pointer-events-auto"
                      : "pointer-events-none"
                  }`}
                >
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={post.postUrl}
                    data-instgrm-version="14"
                    style={{ width: "100%", height: "100%", margin: 0 }}
                  />
                </div>

                {/* HOVER OVERLAY */}
                <div
                  className="
                  absolute inset-0 z-10
                  bg-gradient-to-t from-black/70 via-black/40 to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                  flex flex-col justify-end
                  p-5
                  pointer-events-none
                "
                >
                  <p className="text-white text-sm font-medium line-clamp-1">
                    {post.caption}
                  </p>

                  <div className="mt-2 flex items-center gap-3 text-white text-sm">
                    <span>❤️ {post.likes}</span>

                    <Link
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-80 underline underline-offset-4 hover:opacity-100 pointer-events-auto"
                    >
                      View on Instagram
                    </Link>
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
          className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
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
          className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
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
