"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { timeline } from "./TimelineData";

gsap.registerPlugin(ScrollTrigger);

const Timeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const yearsRef = useRef<HTMLSpanElement[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const totalPanels = panelsRef.current.length;
      const years = yearsRef.current.filter(Boolean);
      const progressLine = document.getElementById("progress-line");

      /* ---------------- SCROLL TIMELINE ---------------- */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalPanels * 100}%`,
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            if (progressLine) {
              gsap.set(progressLine, {
                width: `${self.progress * 100}%`,
              });
            }

            const progressPerPanel = 1 / (totalPanels - 1);
            years.forEach((year, i) => {
              const isActive = self.progress >= i * progressPerPanel;
              gsap.to(year, {
                opacity: isActive ? 1 : 0.4,
                color: isActive ? "#ffffff" : "#aaaaaa",
                duration: 0.2,
              });
            });
          },
        },
      });

      panelsRef.current.forEach((panel, index) => {
        tl.to(
          panel,
          { opacity: 1, filter: "blur(0px)", duration: 0.6 },
          index
        );

        if (index > 0) {
          tl.to(
            panelsRef.current[index - 1],
            { opacity: 0, filter: "blur(14px)", duration: 0.6 },
            index
          );
        }
      });

      /* ---------------- DESKTOP PARALLAX ---------------- */
      const handleMouseMove = (e: MouseEvent) => {
        if (!sectionRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

        panelsRef.current.forEach((panel) => {
          if (!panel || panel.style.opacity === "0") return;

          gsap.to(panel.querySelector(".p-bg"), {
            x: x * 30,
            y: y * 10,
            duration: 0.2,
            ease: "power3.out",
          });

          gsap.to(panel.querySelector(".p-title"), {
            x: x * 50,
            y: y * 40,
            duration: 0.6,
            ease: "power3.out",
          });

          gsap.to(panel.querySelector(".p-image"), {
            x: x * 70,
            y: y * 10,
            duration: 0.3,
            ease: "power3.out",
          });

          gsap.to(panel.querySelector(".p-desc"), {
            x: x * 40,
            y: y * 30,
            duration: 0.6,
            ease: "power3.out",
          });
        });
      };

      /* ---------------- MOBILE GYRO PARALLAX ---------------- */
      const handleOrientation = (e: DeviceOrientationEvent) => {
        const x = (e.gamma ?? 0) / 30;
        const y = (e.beta ?? 0) / 30;

        panelsRef.current.forEach((panel) => {
          if (!panel || panel.style.opacity === "0") return;

          gsap.to(panel.querySelector(".p-image"), {
            x: x * 20,
            y: y * 20,
            duration: 0.6,
            ease: "power3.out",
          });
        });
      };

      if (window.matchMedia("(pointer: fine)").matches) {
        sectionRef.current?.addEventListener("mousemove", handleMouseMove);
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }

      return () => {
        sectionRef.current?.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* -------- TIMELINE BAR -------- */}
      <div className="absolute top-24 md:top-6 left-1/2 -translate-x-1/2 z-30 w-[90%] md:w-[50%]">
        <div className="relative h-[2px] bg-white/20">
          <div
            id="progress-line"
            className="absolute left-0 top-0 h-full w-0 bg-white"
          />
        </div>

        <div className="mt-3 flex justify-between text-xs md:text-sm">
          {timeline.map((item, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) yearsRef.current[i] = el;
              }}
              className="opacity-40"
            >
              {item.year}
            </span>
          ))}
        </div>
      </div>

      {/* -------- PANELS -------- */}
      {timeline.map((item, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) panelsRef.current[i] = el;
          }}
          className="absolute inset-0 opacity-0 blur-xl"
        >
          {/* Background */}
          <Image
            src={item.backgroundImg}
            alt=""
            fill
            priority
            className="object-cover p-bg"
          />

          {/* Title */}
          <h1 className="p-title absolute md:left-[5%] bottom-[75%] md:bottom-[30%] text-3xl md:text-6xl  px-4 md:max-w-md z-20">
            {item.title}
          </h1>

          {/* Center Image */}
          <div className=" p-image absolute bottom-0 left-1/2 -translate-x-1/2 w-full md:w-auto">
            <Image src={item.strImg} alt="" width={1000} height={500} className="object-cover w-full h-[60dvh] md:h-dvh" />
          </div>

          {/* Description */}
          <p className="p-desc absolute px-4 md:right-[5%] bottom-[63%] md:bottom-[5%] text-sm md:text-2xl  md:max-w-lg text-gray-200">
            {item.desc}
          </p>
        </div>
      ))}
    </section>
  );
};

export default Timeline;
