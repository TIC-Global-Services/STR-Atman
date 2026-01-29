"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { useEffect } from "react";

const MusicHero = () => {
  /* ------------------------------------------------------------------ */
  /* SCROLL PARALLAX */
  /* ------------------------------------------------------------------ */

  const { scrollYProgress } = useScroll();

  // Title moves slower (background depth)
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Image moves faster (foreground depth)
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  /* ------------------------------------------------------------------ */
  /* MOUSE PARALLAX (DESKTOP ONLY) */
  /* ------------------------------------------------------------------ */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      mouseX.set(x);
      mouseY.set(y);
    };

    if (window.innerWidth > 1024) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  /* ------------------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------------------ */

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      {/* CONTENT */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {/* TITLE (BACKGROUND LAYER) */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.8, 0.25, 1] }}
          className="absolute inset-0 flex items-center justify-center -translate-y-[12vh]"
        >
          <h1
            className="text-white whitespace-nowrap select-none"
            style={{
              fontFamily: "Halfre, sans-serif",
              fontWeight: 400,
              fontSize: "clamp(2.5rem, 10vw, 7.5rem)",
              lineHeight: "clamp(2.8rem, 8.5vw, 8rem)",
              letterSpacing: "0em",
            }}
          >
            Musical Journey
          </h1>
        </motion.div>

        {/* IMAGE (FOREGROUND LAYER) */}
        <motion.div
          style={{
            y: imageY,
            x: mouseX,
          }}
          initial={{ opacity: 0, y: 80, scale: 1.05 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.8, 0.25, 1] }}
          className="relative z-20 w-full h-full flex items-end justify-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-full h-dvh scale-[1.45]"
          >
            <Image
              src="/musicalsimbu.png"
              alt="Musical Journey"
              fill
              className="object-contain object-bottom"
              priority
            />
          </motion.div>
        </motion.div>
      </div>

      {/* SUBTLE GRADIENT OVERLAY */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
    </section>
  );
};

export default MusicHero;
