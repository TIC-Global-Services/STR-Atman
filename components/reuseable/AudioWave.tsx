import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AudioWaveProps {
  isPlaying: boolean;
  isLightSection: boolean;
}

export const AudioWave = ({ isPlaying, isLightSection }: AudioWaveProps) => {
  const waveGroupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!waveGroupRef.current) return;

    // Clean up any existing animations
    gsap.killTweensOf(waveGroupRef.current);

    if (isPlaying) {
      // Continuous up & down like a sound wave / frequency pulse
      gsap.to(waveGroupRef.current, {
        y: -12,                    // how high it rises
        duration: 1.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Gentle breathing / scale pulse (offset timing = more organic)
      gsap.to(waveGroupRef.current, {
        scale: 1.06,               // subtle grow & shrink
        duration: 2.1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.4,                // slight phase difference
      });
    } else {
      // When paused → smaller, calm, centered
      gsap.to(waveGroupRef.current, {
        scale: 0.82,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      });
    }

    // Cleanup on unmount or when isPlaying changes
    return () => {
      gsap.killTweensOf(waveGroupRef.current);
    };
  }, [isPlaying]);

  return (
    <svg
      viewBox="0 0 213 150"
      width="50"
      height="30"
      className={`
        transition-colors duration-300
        ${isPlaying ? "text-green-500" : `text-white ${isLightSection ? "invert" : "invert-0"}`}
      `}
    >
      {/* Invisible bounding box for layout */}
      <g fill="none">
        <rect width="213" height="150" />
      </g>

      {/* The wave shape – animated */}
      <g
        ref={waveGroupRef}
        fill="currentColor"
        fillOpacity={isPlaying ? 0.9 : 0.6}
        style={{ transformOrigin: "center center" }}
      >
        <path d="
          M 193.00 43.00
          C 162.89 40.81 184.58 101.96 155.01 95.99
          C 125.44 90.03 157.52 45.31 123.00 43.00
          C 88.48 40.69 113.56 95.34 85.00 96.00
          C 56.44 96.66 80.61 39.11 47.00 43.00
          C 13.39 46.90 41.12 90.77 11.00 98.00
          C 46.22 103.89 16.82 46.10 47.00 46.00
          C 77.18 45.90 50.62 97.33 84.00 99.00
          C 117.38 100.67 92.50 47.59 121.00 46.00
          C 149.50 44.42 125.24 101.98 158.00 99.00
          C 190.76 96.01 167.40 52.54 193.00 43.00
          Z"
        />
      </g>
    </svg>
  );
};