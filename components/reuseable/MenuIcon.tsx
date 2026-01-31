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

   
    return (
      <button
        ref={ref}
        onClick={onClick}
        aria-label="Menu"
        className={`
          relative w-10 h-10 flex items-center justify-between cursor-pointer z-50
          transition-colors duration-300
        `}
      >
        {/* TOP LINE */}
        <span
          ref={topLineRef}
          className={`
            absolute h-[3px] rounded-full transition-colors  duration-300
            ${isOpen ? "bg-black" : "bg-green-500"}
          `}
          style={{ top: "14px", width: isOpen ? "0px" : "28px" }} // base width
        />

        {/* BOTTOM LINE */}
        <span
          ref={bottomLineRef}
          className={`
            absolute h-[3px] rounded-full mt-[2px] transition-colors duration-300
            ${isOpen ? "bg-black" : "bg-green-500"}
          `}
          style={{ top: "22px", width: isOpen ? "0px" : "20px" }}
        />
      </button>
    );
  }
);

MenuIcon.displayName = "MenuIcon";