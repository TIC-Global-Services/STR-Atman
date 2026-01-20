"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

interface PageLoaderProps {
  onFinish?: () => void;
}

export default function PageLoader({ onFinish }: PageLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  /* ----------------------------
     PROGRESS (0 → 100 in 3s)
  ----------------------------- */
  useEffect(() => {
    const DURATION = 1500;
    const start = performance.now();
    let raf: number;

    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(Math.floor(pct));
      if (pct < 100) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ----------------------------
     OPENING ANIMATION
  ----------------------------- */
  useEffect(() => {
    if (!panelRef.current || !logoRef.current || !loaderRef.current) return;

    // Ensure correct origin
    gsap.set(panelRef.current, {
      transformOrigin: "top",
      scaleY: 1,
    });

    const tl = gsap.timeline({
      delay: 1.5, // wait for progress
      defaults: { ease: "power2.inOut" },
    });

    // Logo gently fades/lifts
    tl.to(logoRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.8,
    });

    tl.to(
      panelRef.current,
      {
        scaleY: 0,
        duration: 1.2, // slow & smooth
        ease: "power3.inOut",
      },
      "-=0.4"
    );

    // Remove loader AFTER animation
    tl.to(loaderRef.current, {
      pointerEvents: "none",
      onComplete: () => {
        onFinish?.();
      },
    });

    // ✅ CLEANUP (FIXES TS ERROR)
    return () => {
      tl.kill();
    };
  }, [onFinish]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
    >
      {/* PANEL THAT SHRINKS */}
      <div
        ref={panelRef}
        className="absolute inset-0 bg-primary"
      />

      {/* LOGO */}
      <div ref={logoRef} className="relative z-10">
        <Image
          src="/logo/logo.png"
          alt="Logo"
          width={140}
          height={140}
          priority
        />
      </div>

      {/* PROGRESS */}
      <div className="absolute bottom-8 left-8 z-10 text-white text-7xl font-halfre tracking-widest">
        {progress}%
      </div>
    </div>
  );
}
