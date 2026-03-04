"use client";
import { useEffect, useRef, ReactNode } from "react";

// ─── Singleton time source ─────────────────────────────────────────────────────
// All instances share one RAF-driven clock so only ONE rAF runs total.
// Each instance owns its own small canvas but reads from the shared clock.

type TickCallback = (t: number) => void;

let _tickListeners = new Map<number, TickCallback>();
let _rafId: number | null = null;
let _t = 0;
let _lastFrame = 0;
let _nextId = 0;

const TARGET_FPS = 16;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
// Very slow drift — calm, topographic feel
const SPEED = 0.02;

function tickLoop(timestamp: number) {
  _rafId = requestAnimationFrame(tickLoop);
  if (_tickListeners.size === 0) return;

  const elapsed = timestamp - _lastFrame;
  if (elapsed < FRAME_INTERVAL) return;
  _lastFrame = timestamp - (elapsed % FRAME_INTERVAL);

  _t += SPEED * (elapsed / 1000) * 60;
  _tickListeners.forEach((cb) => cb(_t));
}

function startTicker() {
  if (_rafId !== null) return;
  _lastFrame = performance.now();
  _rafId = requestAnimationFrame(tickLoop);
}

function stopTicker() {
  if (_rafId !== null) {
    cancelAnimationFrame(_rafId);
    _rafId = null;
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopTicker();
    else if (_tickListeners.size > 0) startTicker();
  });
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface ContourBackgroundProps {
  children?: ReactNode;
  background?: string;
  lineColor?: string;
  resolution?: number;
  levels?: number;
  lineWidth?: number;
  className?: string;
  /** Opacity of the contour lines (default 0.18) */
  opacity?: number;
}

export default function ContourBackground({
  children,
  background = "#ffffff",
  lineColor = "#7a825c",
  resolution = 24,
  levels = 8,
  lineWidth = 1,
  className = "",
  opacity = 0.18,
}: ContourBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const idRef = useRef<number>(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    if (idRef.current === -1) idRef.current = _nextId++;
    const id = idRef.current;

    const ctx = canvas.getContext("2d", { alpha: true })!;

    // Render at ~35% of display res — purely decorative, upscaling looks soft/natural
    const SCALE = 0.35;
    let W = 0, H = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      W = Math.ceil(rect.width * SCALE);
      H = Math.ceil(rect.height * SCALE);
      canvas.width = W;
      canvas.height = H;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Smooth noise from 3 overlapping sine waves
    const noise = (x: number, y: number, t: number) =>
      Math.sin(x * 0.012 + t) +
      Math.sin(y * 0.016 - t * 0.7) +
      Math.sin((x + y) * 0.009 + t * 0.5);

    const draw = (t: number) => {
      if (W === 0 || H === 0) return;
      ctx.clearRect(0, 0, W, H);

      const cols = Math.ceil(W / resolution);
      const rows = Math.ceil(H / resolution);
      const field = new Float32Array((rows + 1) * (cols + 1));

      let idx = 0;
      for (let y = 0; y <= rows; y++) {
        const yr = y * resolution;
        for (let x = 0; x <= cols; x++) {
          field[idx++] = noise(x * resolution, yr, t);
        }
      }

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (let l = 0; l < levels; l++) {
        const level = -2 + (4 * l) / levels;
        ctx.beginPath();

        for (let y = 0; y < rows; y++) {
          const y0 = y * (cols + 1);
          const y1 = y0 + cols + 1;
          const py = y * resolution;
          const pyN = py + resolution;

          for (let x = 0; x < cols; x++) {
            const i0 = y0 + x;
            const a = field[i0], b = field[i0 + 1];
            const c = field[y1 + x + 1], d = field[y1 + x];

            if (
              (a < level && b < level && c < level && d < level) ||
              (a > level && b > level && c > level && d > level)
            ) continue;

            const px = x * resolution, pxN = px + resolution;
            const state =
              (a > level ? 8 : 0) | (b > level ? 4 : 0) |
              (c > level ? 2 : 0) | (d > level ? 1 : 0);
            if (state === 0 || state === 15) continue;

            const lerp = (p0: number, p1: number, v0: number, v1: number) =>
              p0 + (p1 - p0) * ((level - v0) / (v1 - v0));

            switch (state) {
              case 1: case 14:
                ctx.moveTo(px, lerp(py, pyN, a, d));
                ctx.lineTo(lerp(px, pxN, d, c), pyN); break;
              case 2: case 13:
                ctx.moveTo(lerp(px, pxN, d, c), pyN);
                ctx.lineTo(pxN, lerp(py, pyN, b, c)); break;
              case 3: case 12:
                ctx.moveTo(px, lerp(py, pyN, a, d));
                ctx.lineTo(pxN, lerp(py, pyN, b, c)); break;
              case 4: case 11:
                ctx.moveTo(lerp(px, pxN, a, b), py);
                ctx.lineTo(pxN, lerp(py, pyN, b, c)); break;
              case 6: case 9:
                ctx.moveTo(lerp(px, pxN, a, b), py);
                ctx.lineTo(lerp(px, pxN, d, c), pyN); break;
              case 7: case 8:
                ctx.moveTo(px, lerp(py, pyN, a, d));
                ctx.lineTo(lerp(px, pxN, a, b), py); break;
              case 5:
                ctx.moveTo(px, lerp(py, pyN, a, d));
                ctx.lineTo(lerp(px, pxN, a, b), py);
                ctx.moveTo(pxN, lerp(py, pyN, b, c));
                ctx.lineTo(lerp(px, pxN, d, c), pyN); break;
              case 10:
                ctx.moveTo(lerp(px, pxN, a, b), py);
                ctx.lineTo(pxN, lerp(py, pyN, b, c));
                ctx.moveTo(px, lerp(py, pyN, a, d));
                ctx.lineTo(lerp(px, pxN, d, c), pyN); break;
            }
          }
        }
        ctx.stroke();
      }
    };

    _tickListeners.set(id, draw);
    startTicker();

    return () => {
      _tickListeners.delete(id);
      ro.disconnect();
      if (_tickListeners.size === 0) stopTicker();
    };
  }, [lineColor, resolution, levels, lineWidth]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full ${className}`}
      style={{ backgroundColor: background }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity,
          pointerEvents: "none",
          zIndex: 0,
          // Low-res upscale naturally softens lines — no sharp pixel edges
          imageRendering: "auto",
          // Radial vignette fades the contours out toward all 4 edges,
          // so adjacent page sections never show a hard cut line
          WebkitMaskImage:
            "radial-gradient(ellipse 92% 88% at 50% 50%, black 35%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 92% 88% at 50% 50%, black 35%, transparent 100%)",
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}