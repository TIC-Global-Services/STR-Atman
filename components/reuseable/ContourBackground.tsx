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
  resolution = 6,
  levels = 10,
  lineWidth = 1,
  className = "",
}: ContourBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // 🔹 Pre-allocate scalar field
    const cols = Math.ceil(w / resolution);
    const rows = Math.ceil(h / resolution);
    const field: number[][] = Array.from({ length: rows + 1 }, () =>
      new Array(cols + 1).fill(0)
    );

    const noise = (x: number, y: number, t: number) =>
      Math.sin(x * 0.015 + t) +
      Math.sin(y * 0.02 - t * 0.8) +
      Math.sin((x + y) * 0.01 + t * 0.6);

    const interp = (a: number, b: number, v: number) => a + (b - a) * v;

    let t = 0;

    const draw = (now: number) => {
      // 🔥 FPS LIMIT (30fps)
      if (now - lastTimeRef.current < 33) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTimeRef.current = now;

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // 🔹 Update field ONLY ONCE
      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          field[y][x] = noise(x * resolution, y * resolution, t);
        }
      }

      for (let l = 0; l < levels; l++) {
        const level = interp(-2, 2, l / levels);
        ctx.beginPath();

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const a = field[y][x];
            const b = field[y][x + 1];
            const c = field[y + 1][x + 1];
            const d = field[y + 1][x];

            const px = x * resolution;
            const py = y * resolution;

            const ab = interp(px, px + resolution, (level - a) / (b - a));
            const bc = interp(py, py + resolution, (level - b) / (c - b));
            const cd = interp(px, px + resolution, (level - d) / (c - d));
            const da = interp(py, py + resolution, (level - a) / (d - a));

            const state =
              (a > level ? 8 : 0) |
              (b > level ? 4 : 0) |
              (c > level ? 2 : 0) |
              (d > level ? 1 : 0);

            switch (state) {
              case 1:
              case 14:
                ctx.moveTo(px, da);
                ctx.lineTo(cd, py + resolution);
                break;
              case 2:
              case 13:
                ctx.moveTo(cd, py + resolution);
                ctx.lineTo(px + resolution, bc);
                break;
              case 3:
              case 12:
                ctx.moveTo(px, da);
                ctx.lineTo(px + resolution, bc);
                break;
              case 4:
              case 11:
                ctx.moveTo(ab, py);
                ctx.lineTo(px + resolution, bc);
                break;
              case 6:
              case 9:
                ctx.moveTo(ab, py);
                ctx.lineTo(cd, py + resolution);
                break;
              case 7:
              case 8:
                ctx.moveTo(px, da);
                ctx.lineTo(ab, py);
                break;
              case 5:
                ctx.moveTo(px, da);
                ctx.lineTo(ab, py);
                ctx.moveTo(px + resolution, bc);
                ctx.lineTo(cd, py + resolution);
                break;
              case 10:
                ctx.moveTo(ab, py);
                ctx.lineTo(px + resolution, bc);
                ctx.moveTo(px, da);
                ctx.lineTo(cd, py + resolution);
                break;
            }
          }
        }

        ctx.stroke();
      }

      t += speed;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    // 🔹 Pause when tab hidden
    const onVisibility = () => {
      if (document.hidden && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      } else {
        lastTimeRef.current = 0;
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
    <section ref={containerRef} className={`relative overflow-hidden  ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </section>
  );
}
