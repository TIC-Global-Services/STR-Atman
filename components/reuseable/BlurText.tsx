"use client";
import { useEffect, useRef, useState } from "react";

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom" | "left" | "right";
  className?: string;
  threshold?: number;
}

export default function BlurText({
  text,
  delay = 50,
  animateBy = "words",
  direction = "top",
  className = "",
  threshold = 0.3,
}: BlurTextProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);

  const [isVisible, setIsVisible] = useState(false);
  const [animatedItems, setAnimatedItems] = useState<boolean[]>([]);

  const items = animateBy === "words" ? text.split(" ") : text.split("");

  /* ===============================
     INTERSECTION OBSERVER
  =============================== */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    if (elementRef.current) observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [threshold]);

  /* ===============================
     PLAY / RESET ANIMATION
  =============================== */
  useEffect(() => {
    // Clear any running timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    if (!isVisible) {
      // RESET when out of view
      setAnimatedItems(new Array(items.length).fill(false));
      return;
    }

    // PLAY when in view
    setAnimatedItems(new Array(items.length).fill(false));

    items.forEach((_, index) => {
      const timeout = window.setTimeout(() => {
        setAnimatedItems((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
      }, index * delay);

      timeoutsRef.current.push(timeout);
    });

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [isVisible, delay, items.length]);

  /* ===============================
     TRANSFORM DIRECTION
  =============================== */
  const getTransformStyle = (isAnimated: boolean) => {
    if (isAnimated) return "translate(0, 0)";

    switch (direction) {
      case "top":
        return "translateY(-20px)";
      case "bottom":
        return "translateY(20px)";
      case "left":
        return "translateX(-20px)";
      case "right":
        return "translateX(20px)";
      default:
        return "translateY(-20px)";
    }
  };

  return (
    <div ref={elementRef} className={className}>
      {items.map((item, index) => (
        <span
          key={index}
          className="inline-block transition-all duration-500 ease-out"
          style={{
            filter: animatedItems[index] ? "blur(0px)" : "blur(10px)",
            opacity: animatedItems[index] ? 1 : 0,
            transform: getTransformStyle(animatedItems[index]),
          }}
        >
          {item}
          {animateBy === "words" && index < items.length - 1 && (
            <span>&nbsp;</span>
          )}
        </span>
      ))}
    </div>
  );
}
