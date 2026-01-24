import React, { useEffect, useRef } from "react";

interface SineWaveProps {
  isPlaying: boolean;
  isLightSection: boolean;
}

const AudioWave = ({ isPlaying, isLightSection }: SineWaveProps) => {
  const pathRef = useRef<SVGPathElement>(null);
  const animationIdRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    // Wave Configuration
    const width = 200;      // SVG internal width
    const height = 100;     // SVG internal height
    const amplitude = 40;   // Height of the wave peaks
    const frequency = 0.14; // Tightness of the loops
    const speed = 0.15;     // Animation speed
    const points = 120;      // Higher = smoother curve

    const draw = () => {
      if (!pathRef.current) return;

      // Only animate phase if playing
      if (isPlaying) {
        phaseRef.current += speed;
      }

      // Start the SVG path
      let pathData = `M 0 ${height / 2}`;

      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        
        // 1. Basic Sine Wave Calculation
        const sineValue = Math.sin(x * frequency + phaseRef.current);

        // 2. Attenuation (Windowing)
        // This makes the wave flat at the ends and tall in the middle (Sine Window)
        const progress = i / points;
        const envelope = Math.sin(progress * Math.PI); 

        // 3. Final Y Position
        const y = (height / 2) + (sineValue * amplitude * envelope);

        pathData += ` L ${x} ${y}`;
      }

      pathRef.current.setAttribute("d", pathData);
      
      // Keep loop running to handle pause/play smoothness
      animationIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [isPlaying]);

  return (
    <svg
      viewBox="0 0 180 100"
      className="w-full h-full mx-auto"
      style={{ 
        maxWidth: "32px", 
        display: "block",
        overflow: "visible" 
      }}
    >
      <path
        ref={pathRef}
        fill="none"
        // Toggle color based on isLightSection
        stroke={isPlaying ? "#0de65a" : (isLightSection ? "#000000" : "#ffffff")}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-300" 
      />
    </svg>
  );
};

export default AudioWave;