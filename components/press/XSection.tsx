"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

declare global {
  interface Window {
    twttr: any;
  }
}

const XSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  /* ==============================
     X POSTS (EXACT TWEETS)
  ============================== */
  const xPosts = [
    {
      id: 1,
      postUrl: "https://twitter.com/Arasanfilm_/status/2002707559153889516",
    },
    {
      id: 2,
      postUrl: "https://twitter.com/SilambarasanTR_/status/1998434523718291507",
    },
    {
      id: 3,
      postUrl: "https://twitter.com/SilambarasanTR_/status/1995092985256833217",
    },
  ];

  /* ==============================
     INFINITE SETUP
  ============================== */
  const [currentIndex, setCurrentIndex] = useState(xPosts.length);
  const extendedPosts = [...xPosts, ...xPosts, ...xPosts];

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
        if (next >= xPosts.length * 2) {
          setTimeout(() => setCurrentIndex(xPosts.length), 50);
          return next;
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isInView, xPosts.length]);

  /* ==============================
     LOAD X SCRIPT (ONCE)
  ============================== */
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
    } else {
      window.twttr.widgets.load();
    }
  }, []);

  /* ==============================
     REPROCESS EMBEDS
  ============================== */
  useEffect(() => {
    if (window.twttr) {
      window.twttr.widgets.load();
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
    <section
      data-lenis-prevent
      ref={sectionRef}
      className="relative w-full py-20"
    >
      {/* TITLE */}
      <div className="text-center mb-16 px-6 lg:px-12">
        <h2 className="text-black text-2xl md:text-5xl mb-6">X Highlights</h2>
        <p className="text-[#717580] text-base md:text-[20px] max-w-4xl mx-auto">
          A curated glimpse into official posts from X.
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
                {/* X EMBED */}
                <div
                  data-lenis-prevent
                  className={`absolute inset-0 ${
                    index === currentIndex
                      ? "pointer-events-auto"
                      : "pointer-events-none"
                  }`}
                >
                  <blockquote
                    className="twitter-tweet"
                    data-theme="light"
                    data-dnt="true"
                    style={{ width: "100%", height: "100%", margin: 0 }}
                  >
                    <a href={post.postUrl}></a>
                  </blockquote>
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

export default XSection;
