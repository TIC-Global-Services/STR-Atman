"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { timeline } from "./TimelineData";

gsap.registerPlugin(ScrollTrigger);

const Timeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const desktopPanelsRef = useRef<HTMLDivElement[]>([]);
  const mobilePanelsRef = useRef<HTMLDivElement[]>([]);
  const yearsRef = useRef<HTMLSpanElement[]>([]);
  const mobileYearsRef = useRef<HTMLSpanElement[]>([]);

 useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    const panels = isDesktop
      ? desktopPanelsRef.current
      : mobilePanelsRef.current;

    const totalPanels = panels.length;

    const progressLine = document.getElementById("progress-line");
    const mobileLine = document.getElementById("mobile-progress-line");

    let currentIndex = 0;
    let isAnimating = false;
    let observer: any;

    /* ---------------- INITIAL STATE ---------------- */

    gsap.set(panels, {
      opacity: 0,
      filter: "blur(16px)",
    });

    gsap.set(panels[0], {
      opacity: 1,
      filter: "blur(0px)",
    });

    /* ---------------- PANEL CHANGE ---------------- */

    const showPanel = (nextIndex: number) => {
      if (nextIndex === currentIndex) return;
      if (nextIndex < 0 || nextIndex >= totalPanels) return;

      const currentPanel = panels[currentIndex];
      const nextPanel = panels[nextIndex];

      isAnimating = true;

      const tl = gsap.timeline({
        onComplete: () => {
          currentIndex = nextIndex;
          isAnimating = false;
        },
      });

      tl.to(currentPanel, {
        opacity: 0,
        filter: "blur(16px)",
        duration: 0.6,
        ease: "power2.out",
      });

      tl.fromTo(
        nextPanel,
        {
          opacity: 0,
          filter: "blur(16px)",
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power2.out",
        },
        "<"
      );

      /* -------- progress bar -------- */

      const step = 1 / (totalPanels - 1);

      if (progressLine) {
        gsap.to(progressLine, {
          width: `${nextIndex * step * 100}%`,
          duration: 0.3,
        });
      }

      if (mobileLine) {
        gsap.to(mobileLine, {
          width: `${nextIndex * step * 100}%`,
          duration: 0.3,
        });
      }

      /* -------- year highlight -------- */

      yearsRef.current.forEach((year, i) => {
        if (!year) return;

        gsap.to(year, {
          opacity: i === nextIndex ? 1 : 0.4,
          color: i === nextIndex ? "#fff" : "#999",
          duration: 0.2,
        });
      });

      mobileYearsRef.current.forEach((year, i) => {
        if (!year) return;

        gsap.to(year, {
          opacity: i === nextIndex ? 1 : 0.45,
          scale: i === nextIndex ? 1.05 : 1,
          duration: 0.25,
        });
      });
    };

    /* ---------------- ENABLE SCROLL CONTROL ---------------- */

    const enableScroll = () => {
      if (observer) return;

      observer = ScrollTrigger.observe({
        target: window,
        type: "wheel,touch,pointer",
        wheelSpeed: 1,
        tolerance: 10,
        preventDefault: true,

        onDown: () => {
          if (isAnimating) return;
          showPanel(currentIndex + 1);
        },

        onUp: () => {
          if (isAnimating) return;
          showPanel(currentIndex - 1);
        },
      });
    };

    const disableScroll = () => {
      observer?.kill();
      observer = null;
    };

    /* ---------------- PIN SECTION ---------------- */

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=200%",
      pin: true,
      pinSpacing: true,

      onEnter: () => enableScroll(),
      onEnterBack: () => enableScroll(),

      onLeave: () => disableScroll(),
      onLeaveBack: () => disableScroll(),
    });

    /* ---------------- DESKTOP PARALLAX ---------------- */

    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current || !isDesktop) return;

      const rect = sectionRef.current.getBoundingClientRect();

      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      const activePanel = panels[currentIndex];

      if (!activePanel) return;

      gsap.to(activePanel.querySelector(".p-bg"), {
        x: x * 30,
        y: y * 20,
        duration: 0.3,
      });

      gsap.to(activePanel.querySelector(".p-title"), {
        x: x * 50,
        y: y * 40,
        duration: 0.6,
      });

      gsap.to(activePanel.querySelector(".p-desc"), {
        x: x * 40,
        y: y * 30,
        duration: 0.6,
      });
    };

    sectionRef.current?.addEventListener("mousemove", handleMouseMove);

    return () => {
      observer?.kill();
      sectionRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, sectionRef);

  return () => ctx.revert();
}, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* ================= DESKTOP TIMELINE ================= */}
      <div className="hidden lg:block absolute top-6 left-1/2 -translate-x-1/2 z-30 w-[55%]">
        <div className="relative h-[2px] bg-white/20">
          <div
            id="progress-line"
            className="absolute left-0 top-0 h-full w-0 bg-white"
          />
        </div>

        <div className="mt-3 flex justify-between text-sm">
          {timeline.map((item, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) yearsRef.current[i] = el;
              }}
              className="opacity-40 text-center"
            >
              {item.year}
            </span>
          ))}
        </div>
      </div>

      {/* ================= MOBILE TIMELINE ================= */}
      <div className="lg:hidden absolute top-[10%] z-30 w-full px-4">
        {/* Progress bar */}
        <div className="relative h-[2px] bg-white/20 mb-4 overflow-hidden">
          <div
            id="mobile-progress-line"
            className="absolute left-0 top-0 h-full w-0 bg-white"
          />
        </div>

        {/* Years rail */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-6 min-w-max">
            {timeline.map((item, i) => (
              <span
                key={i}
                ref={(el) => {
                  if (el) mobileYearsRef.current[i] = el;
                }}
                className="mobile-year text-sm tracking-wide
                     text-white/50
                     whitespace-nowrap
                     transition-all duration-200"
              >
                {item.year}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= DESKTOP PANELS ================= */}
      {timeline.map((item, i) => (
        <div
          key={`desktop-${i}`}
          ref={(el) => {
            if (el) desktopPanelsRef.current[i] = el;
          }}
          className="hidden lg:block absolute inset-0 opacity-0 blur-xl"
        >
          <Image
            src={item.backgroundImg}
            alt=""
            fill
            priority
            className="object-cover p-bg"
          />

          <h1 className="p-title absolute left-[5%] bottom-[30%] text-6xl max-w-md">
            {item.title}
          </h1>

          <div className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-full h-dvh">
            <Image
              src={item.strImg}
              alt="STR"
              priority
              width={600}
              height={600}
              className=" w-1/2 mx-auto"
            />
          </div>

          <p
            className={`p-desc absolute right-[5%] bottom-[6%] text-xl max-w-md ${
              i === 3 ? "text-[#303030]" : "text-neutral-300"
            }`}
          >
            {item.desc}
          </p>
        </div>
      ))}

      {/* ================= MOBILE PANELS ================= */}
      {timeline.map((item, i) => (
        <div
          key={`mobile-${i}`}
          ref={(el) => {
            if (el) mobilePanelsRef.current[i] = el;
          }}
          className="lg:hidden absolute inset-0 opacity-0 blur-xl"
        >
          <Image
            src={item.backgroundImg}
            alt=""
            fill
            priority
            className="object-cover"
          />

          <div className="absolute top-[18%] px-4 space-y-3">
            <h1 className="text-2xl font-semibold">{item.title}</h1>
            <p className="text-sm text-gray-300">{item.desc}</p>
          </div>

          <div className="absolute bottom-0 w-full">
            <Image
              src={item.strImg}
              alt=""
              width={800}
              height={600}
              className="w-full h-[55vh] object-cover"
              priority
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default Timeline;
