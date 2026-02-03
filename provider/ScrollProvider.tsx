"use client";
import { ReactNode, useRef, useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import gsap from "gsap";

interface LenisProviderProps {
  children: ReactNode;
}

const ScrollProvider = ({ children }: LenisProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /* ---------------------------------------------------
       1. Allow browser native scroll restoration
    --------------------------------------------------- */
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "auto"; // <-- important
    }

    /* ---------------------------------------------------
       2. Initialize Lenis AFTER the browser restores scroll
    --------------------------------------------------- */
    requestAnimationFrame(() => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
        syncTouch: false,
        autoRaf: false, // <-- changed (important!)

        prevent: (node) => {
          return node?.hasAttribute?.("data-lenis-prevent");
        },
      });

      lenisRef.current = lenis;

      lenis.on("scroll", () => ScrollTrigger.update());

      /* ---------------------------------------------------
         3. Proper GSAP scrollerProxy that doesn't override
            browser's scroll on page load
      --------------------------------------------------- */
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (value !== undefined) {
            lenis.scrollTo(value, { immediate: true });
          }
          return window.scrollY;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });

      /* ---------------------------------------------------
         4. Manual RAF so Lenis doesn't fight scroll restore
      --------------------------------------------------- */
      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      ScrollTrigger.addEventListener("refresh", () => lenis.resize());
      ScrollTrigger.refresh();
    });

    return () => {
      lenisRef.current?.destroy();
      ScrollTrigger.killAll();
    };
  }, []);

  return <>{children}</>;
};

export default ScrollProvider;
