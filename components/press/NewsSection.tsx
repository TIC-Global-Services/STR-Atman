"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const NewsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isInView, setIsInView] = useState(false);

  /* ==============================
     DATA
  ============================== */
  const newsCards = [
    {
      id: 1,
      image: "/newsroom/news1.png",
      alt: "STR News 1",
    },
    {
      id: 2,
      image: "/newsroom/news2.png",
      alt: "STR Announces Upcoming Project",
      hasOverlay: true,
      title: "STR Announces Upcoming Project",
      cta: "View →",
    },
    {
      id: 3,
      image: "/newsroom/news3.png",
      alt: "STR News 3",
    },
  ];

  /* ==============================
     INFINITE SETUP
  ============================== */
  const [currentIndex, setCurrentIndex] = useState(newsCards.length);
  const extendedCards = [...newsCards, ...newsCards, ...newsCards];

  /* ==============================
     RESPONSIVE LAYOUT
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
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ==============================
     AUTOPLAY CONTROLS
  ============================== */
  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startAutoPlay = () => {
    stopAutoPlay();

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;

        if (next >= newsCards.length * 2) {
          setTimeout(() => {
            setCurrentIndex(newsCards.length);
          }, 50);
          return next;
        }

        return next;
      });
    }, 3000);
  };

  useEffect(() => {
    if (isInView) startAutoPlay();
    else stopAutoPlay();

    return stopAutoPlay;
  }, [isInView]);

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
      marginLeft: isCenter
        ? `-${centerWidth / 2}px`
        : `-${sideWidth / 2}px`,
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

  /* ==============================
     ARROW HANDLERS
  ============================== */
  const handlePrev = () => {
    stopAutoPlay();
    setCurrentIndex((prev) => prev - 1);
    setTimeout(startAutoPlay, 700);
  };

  const handleNext = () => {
    stopAutoPlay();
    setCurrentIndex((prev) => prev + 1);
    setTimeout(startAutoPlay, 700);
  };

  return (
    <section ref={sectionRef} className=" light relative w-full py-16">
      {/* TITLE */}
      <div className="text-center mb-12 px-6 lg:px-12">
        <h2 className="text-black mb-6 text-2xl md:text-5xl">
          Official news & announcements
        </h2>
        <p className="text-[#717580] text-base md:text-[20px] max-w-3xl mx-auto">
          Verified updates, media coverage, and official announcements related
          to Silambarasan TR.
        </p>
      </div>

      {/* CAROUSEL */}
      <div
        className="relative w-full overflow-hidden h-[200px] md:h-[450px]"
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
      >
        <div className="relative w-full">
          {layout &&
            extendedCards.map((card, index) => (
              <div
                key={`${card.id}-${index}`}
                className="relative overflow-hidden rounded-2xl group"
                style={getCardStyle(index)}
              >
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  className="object-cover"
                />

                {card.hasOverlay && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white text-lg font-medium">
                        {card.title}
                      </h3>
                      <p className="text-white/80 text-sm">{card.cta}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* ARROWS */}
      <div className="flex justify-end pr-6 lg:pr-12 mt-8 space-x-4">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-black transition-all"
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
          onClick={handleNext}
          className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-black transition-all"
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

export default NewsSection;
