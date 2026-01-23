"use client";

import { forwardRef } from "react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

interface MenuIconProps {
  isOpen: boolean;
  onClick?: () => void;
}

export const MenuIcon = forwardRef<HTMLButtonElement, MenuIconProps>(
  ({ isOpen, onClick }, ref) => {
    const topLineRef = useRef<HTMLSpanElement>(null);
    const bottomLineRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      if (!topLineRef.current || !bottomLineRef.current) return;

      const tl = gsap.timeline({ defaults: { duration: 0.35, ease: "power3.out" } });

      if (isOpen) {
        tl
          .to(topLineRef.current, {
            y: 4,
            rotate: 45,
            width: 28,
          })
          .to(
            bottomLineRef.current,
            {
              y: -4,
              rotate: -45,
              width: 28,
            },
            "<"
          );
      } else {
        tl
          .to(topLineRef.current, {
            y: 0,
            rotate: 0,
            width: 28,           // or keep 20 if you prefer the original look when closed
          })
          .to(
            bottomLineRef.current,
            {
              y: 0,
              rotate: 0,
              width: 20,           // ← restored your original closed width
            },
            "<"
          );
      }
    }, [isOpen]);

    return (
      <button
        ref={ref}
        onClick={onClick}
        aria-label="Menu"
        className={`
          relative w-10 h-10 flex items-center justify-start cursor-pointer z-50
          transition-colors duration-300
          ${isOpen ? "bg-white rounded-xl" : "bg-transparent"}
        `}
      >
        {/* TOP LINE */}
        <span
          ref={topLineRef}
          className={`
            absolute h-[3px] rounded-full transition-colors mb-2 duration-300
            ${isOpen ? "bg-black" : "bg-green-500"}
          `}
          style={{ top: "14px", width: isOpen ? "28px" : "28px" }} // base width
        />

        {/* BOTTOM LINE */}
        <span
          ref={bottomLineRef}
          className={`
            absolute h-[3px] rounded-full transition-colors duration-300
            ${isOpen ? "bg-black" : "bg-green-500"}
          `}
          style={{ top: "22px", width: isOpen ? "28px" : "20px" }}
        />
      </button>
    );
  }
);

MenuIcon.displayName = "MenuIcon";