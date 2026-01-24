"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import AnimatedLogo from "./AnimatedLogo";
import AnimatedLogo2 from "./AnimatedLogo2";

interface PageLoaderProps {
  onFinish?: () => void;
}

export default function PageLoader({ onFinish }: PageLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false); // ✅ guard

  /* ----------------------------
     PROGRESS (0 → 100)
  ----------------------------- */
  useEffect(() => {
    const DURATION = 3500;
    const start = performance.now();
    let raf: number;

    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(Math.floor(pct));

      if (pct < 100) raf = requestAnimationFrame(tick);
      else setDone(true); // ✅ mark completed
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ----------------------------
     ANIMATE ONLY AFTER 100%
  ----------------------------- */
  useEffect(() => {
    if (!done || !panelRef.current || !logoRef.current || !loaderRef.current)
      return;

    gsap.set(panelRef.current, {
      transformOrigin: "top",
      scaleY: 1,
    });

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
    });

    tl.to(logoRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.8,
    });

    tl.to(
      panelRef.current,
      {
        scaleY: 0,
        duration: 1.2,
        ease: "power3.inOut",
      },
      "-=0.4"
    );

    tl.call(() => {
      onFinish?.();
    });

    return () => {
      tl.kill();
    };
  }, [done, onFinish]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
    >
      {/* PANEL */}
      <div ref={panelRef} className="absolute inset-0 bg-primary" />

      {/* LOGO */}
      <div ref={logoRef} className="relative z-10 scale-200">
        <AnimatedLogo2 />
      </div>

      {/* PROGRESS */}
      <div className="absolute bottom-8 left-8 z-10 text-white text-7xl font-halfre tracking-widest">
        {progress}%
      </div>
    </div>
  );
}
