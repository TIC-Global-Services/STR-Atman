"use client";
import { useEffect, useRef, ReactNode } from "react";

interface ContourBackgroundProps {
  children?: ReactNode;
  background?: string;
  lineColor?: string;
  speed?: number;
  resolution?: number;
  levels?: number;
  lineWidth?: number;
  className?: string;
}

export default function ContourBackground({
  children,
  background = "#eef1e4",
  lineColor = "rgba(120,130,90,0.22)",
  speed = 0.001,
  resolution = 16,
  levels = 5,
  lineWidth = 1,
  className = "",
}: ContourBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { 
      alpha: false,
      desynchronized: true 
    })!;
    
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let field: Float32Array;
    let t = 0;
    let lastFrame = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      cols = Math.ceil(w / resolution);
      rows = Math.ceil(h / resolution);
      field = new Float32Array((rows + 1) * (cols + 1));
    };

    resize();
    window.addEventListener("resize", resize);

    // Optimized noise function
    const noise = (x: number, y: number, t: number) => {
      const x015 = x * 0.015;
      const y02 = y * 0.02;
      const t8 = t * 0.8;
      const t6 = t * 0.6;
      return Math.sin(x015 + t) + Math.sin(y02 - t8) + Math.sin((x + y) * 0.01 + t6);
    };

    const draw = (timestamp: number) => {
      rafRef.current = requestAnimationFrame(draw);
      
      const elapsed = timestamp - lastFrame;
      if (elapsed < frameInterval) return;
      
      lastFrame = timestamp - (elapsed % frameInterval);

      // Clear canvas
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);

      // Update field
      let idx = 0;
      for (let y = 0; y <= rows; y++) {
        const yRes = y * resolution;
        for (let x = 0; x <= cols; x++) {
          field[idx++] = noise(x * resolution, yRes, t);
        }
      }

      // Setup stroke style once
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // Draw contours
      for (let l = 0; l < levels; l++) {
        const level = -2 + (4 * l / levels);
        
        ctx.beginPath();

        for (let y = 0; y < rows; y++) {
          const y0 = y * (cols + 1);
          const y1 = y0 + (cols + 1);
          const py = y * resolution;
          const pyNext = py + resolution;

          for (let x = 0; x < cols; x++) {
            const idx0 = y0 + x;
            const idx1 = idx0 + 1;
            const idx2 = y1 + x + 1;
            const idx3 = y1 + x;

            const a = field[idx0];
            const b = field[idx1];
            const c = field[idx2];
            const d = field[idx3];

            // Quick bounds check
            if ((a < level && b < level && c < level && d < level) ||
                (a > level && b > level && c > level && d > level)) {
              continue;
            }

            const px = x * resolution;
            const pxNext = px + resolution;

            const state =
              (a > level ? 8 : 0) |
              (b > level ? 4 : 0) |
              (c > level ? 2 : 0) |
              (d > level ? 1 : 0);

            if (state === 0 || state === 15) continue;

            // Interpolation helper
            const lerp = (p0: number, p1: number, v0: number, v1: number) => 
              p0 + (p1 - p0) * ((level - v0) / (v1 - v0));

            switch (state) {
              case 1:
              case 14:
                ctx.moveTo(px, lerp(py, pyNext, a, d));
                ctx.lineTo(lerp(px, pxNext, d, c), pyNext);
                break;
              case 2:
              case 13:
                ctx.moveTo(lerp(px, pxNext, d, c), pyNext);
                ctx.lineTo(pxNext, lerp(py, pyNext, b, c));
                break;
              case 3:
              case 12:
                ctx.moveTo(px, lerp(py, pyNext, a, d));
                ctx.lineTo(pxNext, lerp(py, pyNext, b, c));
                break;
              case 4:
              case 11:
                ctx.moveTo(lerp(px, pxNext, a, b), py);
                ctx.lineTo(pxNext, lerp(py, pyNext, b, c));
                break;
              case 6:
              case 9:
                ctx.moveTo(lerp(px, pxNext, a, b), py);
                ctx.lineTo(lerp(px, pxNext, d, c), pyNext);
                break;
              case 7:
              case 8:
                ctx.moveTo(px, lerp(py, pyNext, a, d));
                ctx.lineTo(lerp(px, pxNext, a, b), py);
                break;
              case 5:
                ctx.moveTo(px, lerp(py, pyNext, a, d));
                ctx.lineTo(lerp(px, pxNext, a, b), py);
                ctx.moveTo(pxNext, lerp(py, pyNext, b, c));
                ctx.lineTo(lerp(px, pxNext, d, c), pyNext);
                break;
              case 10:
                ctx.moveTo(lerp(px, pxNext, a, b), py);
                ctx.lineTo(pxNext, lerp(py, pyNext, b, c));
                ctx.moveTo(px, lerp(py, pyNext, a, d));
                ctx.lineTo(lerp(px, pxNext, d, c), pyNext);
                break;
            }
          }
        }
        
        ctx.stroke();
      }

      t += speed;
    };

    rafRef.current = requestAnimationFrame(draw);

    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else if (!rafRef.current) {
        lastFrame = performance.now();
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [background, lineColor, speed, resolution, levels, lineWidth]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}