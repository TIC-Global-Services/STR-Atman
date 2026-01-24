"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/* ===============================================================
   🎨 CONFIGURATION
=============================================================== */
const CONFIG = {
  // Image paths
  BASE_IMAGE: "/Home/Str-07.png",
  REVEAL_IMAGES: [
    "/Home/Str-01.png",
    "/Home/Str-02.png",
    "/Home/Str-03.png",
    "/Home/Str-05.png",
    "/Home/Str-06.png",
    "/Home/Str-09.png",
    "/Home/Str-10.png",
    "/Home/Str-11.png",
  ],
  
  // Timing
  IDLE_DELAY: 1000,
  RETURN_SPEED: 0.68,
  RESET_CHECK_INTERVAL: 50,
  RESET_THRESHOLD: 2,
  
  // Fluid behavior
  ACTIVE_DECAY: 0.965,
  TRAIL_WIDTH: 0.08,
  TRAIL_INTENSITY: 0.8,
  REVEAL_SMOOTHNESS: 0.35,
  REVEAL_TRANSITION: 0.38,
  
  // Rendering
  FLUID_RESOLUTION: 512,

  AUTO_REVEAL_AFTER_IDLE_MS: 1000,     // start auto after user is idle this long
  AUTO_MOVE_DURATION_MS: 5200,         // how long should one full zig-zag take
  AUTO_MOVE_STEPS: 180,
};

/* ===============================================================
   🎭 SHADERS
=============================================================== */
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fluidFragmentShader = `
uniform sampler2D uPrevTrails;
uniform vec2 uMouse;
uniform vec2 uPrevMouse;
uniform float uDecay;
uniform bool uIsMoving;
uniform float uIdleDecay;
uniform float uTrailWidth;
uniform float uTrailIntensity;
varying vec2 vUv;

void main() {
  vec4 prev = texture2D(uPrevTrails, vUv);
  float value = prev.r * uDecay;

  if (uIsMoving) {
    vec2 dir = uMouse - uPrevMouse;
    float len = length(dir);
    if (len > 0.0001) {
      vec2 d = dir / len;
      vec2 toPix = vUv - uPrevMouse;
      float proj = clamp(dot(toPix, d), 0.0, len);
      vec2 closest = uPrevMouse + proj * d;
      float dist = length(vUv - closest);
      value += smoothstep(uTrailWidth, 0.0, dist) * uTrailIntensity;
    }
  } else {
    value *= uIdleDecay;
  }

  gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
}
`;

const displayFragmentShader = `
uniform sampler2D uFluid;
uniform sampler2D uTopTexture;
uniform sampler2D uBottomTexture;
uniform vec2 uResolution;
uniform vec2 uTopTexSize;
uniform vec2 uBottomTexSize;
uniform float uRevealSmooth;
uniform float uRevealTransition;

varying vec2 vUv;

vec2 coverUV(vec2 uv, vec2 texSize) {
  vec2 s = uResolution / texSize;
  float scale = max(s.x, s.y);
  vec2 scaled = texSize * scale;
  vec2 offset = (uResolution - scaled) * 0.5;
  return (uv * uResolution - offset) / scaled;
}

void main() {
  float fluid = texture2D(uFluid, vUv).r;

  vec2 uvTop = coverUV(vUv, uTopTexSize);
  vec2 uvBot = coverUV(vUv, uBottomTexSize);

  vec4 base = texture2D(uBottomTexture, uvBot);
  vec4 reveal = texture2D(uTopTexture, uvTop);

  float edge = smoothstep(uRevealSmooth, uRevealTransition, fluid);
  gl_FragColor = mix(base, reveal, edge);
}
`;

/* ===============================================================
   🎬 FLUID SCENE
=============================================================== */
function FluidScene() {
  const { gl, size } = useThree();

  const baseTexture   = useTexture(CONFIG.BASE_IMAGE);
  const revealTextures = useTexture(CONFIG.REVEAL_IMAGES);

  const renderTargets = useMemo(() => {
    const res = CONFIG.FLUID_RESOLUTION;
    return {
      rtA: new THREE.WebGLRenderTarget(res, res),
      rtB: new THREE.WebGLRenderTarget(res, res),
    };
  }, []);

  const stateRef = useRef({
    curr: renderTargets.rtA,
    prev: renderTargets.rtB,
    mouse: new THREE.Vector2(0.5, 0.5),
    prevMouse: new THREE.Vector2(0.5, 0.5),
    isMoving: false,
    isOverImage: false,
    canSwitchImage: true,
    revealIndex: 0,
    idleTimeout: null as NodeJS.Timeout | null,
  });

  // Auto reveal control
  const autoActive      = useRef(false);
  const autoStartTime   = useRef(0);
  const autoProgress    = useRef(0);
  const virtualMousePos = useRef(new THREE.Vector2(0.08, 0.5));

  const startIdleTimerRef = useRef<() => void>(() => {});

  const textureSizes = useMemo(() => ({
    baseSize: new THREE.Vector2(
      (baseTexture.image as HTMLImageElement)?.width  ?? 1920,
      (baseTexture.image as HTMLImageElement)?.height ?? 1080
    ),
    revealSize: new THREE.Vector2(
      (revealTextures[0].image as HTMLImageElement)?.width  ?? 1920,
      (revealTextures[0].image as HTMLImageElement)?.height ?? 1080
    ),
  }), [baseTexture, revealTextures]);

  const fluidMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: fluidFragmentShader,
    uniforms: {
      uPrevTrails:     { value: null },
      uMouse:          { value: stateRef.current.mouse },
      uPrevMouse:      { value: stateRef.current.prevMouse },
      uDecay:          { value: CONFIG.ACTIVE_DECAY },
      uIdleDecay:      { value: CONFIG.RETURN_SPEED },
      uIsMoving:       { value: false },
      uTrailWidth:     { value: CONFIG.TRAIL_WIDTH },
      uTrailIntensity: { value: CONFIG.TRAIL_INTENSITY },
    },
  }), []);

  const displayMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: displayFragmentShader,
    uniforms: {
      uFluid:         { value: null },
      uBottomTexture: { value: baseTexture },
      uTopTexture:    { value: revealTextures[0] },
      uResolution:    { value: new THREE.Vector2() },
      uTopTexSize:    { value: textureSizes.revealSize },
      uBottomTexSize: { value: textureSizes.baseSize },
      uRevealSmooth:  { value: CONFIG.REVEAL_SMOOTHNESS },
      uRevealTransition: { value: CONFIG.REVEAL_TRANSITION },
    },
    transparent: true,
  }), [baseTexture, revealTextures, textureSizes]);

  const fluidScene = useMemo(() => {
    const s = new THREE.Scene();
    s.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2), fluidMaterial));
    return s;
  }, [fluidMaterial]);

  const fluidCamera = useMemo(() =>
    new THREE.OrthographicCamera(-1,1,1,-1,0,1), []);

  // ─── Interaction + Idle → Auto logic ────────────────────────────────
  useEffect(() => {
    const canvas = gl.domElement;
    const state = stateRef.current;
    let idleTimer: NodeJS.Timeout | null = null;

    const startIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!state.isOverImage || autoActive.current) return;

        autoActive.current = true;
        autoStartTime.current = performance.now();
        autoProgress.current = 0;
        virtualMousePos.current.set(0.08, 0.5);

        const idx = Math.floor(Math.random() * revealTextures.length);
        displayMaterial.uniforms.uTopTexture.value = revealTextures[idx];
        state.canSwitchImage = false;
      }, CONFIG.AUTO_REVEAL_AFTER_IDLE_MS);
    };

    startIdleTimerRef.current = startIdleTimer;

    const stopAutoIfRunning = () => {
      if (autoActive.current) {
        autoActive.current = false;
        state.isMoving = false;
        fluidMaterial.uniforms.uIsMoving.value = false;
      }
    };

    const onMouseEnter = () => {
      state.isOverImage = true;
      startIdleTimer();
    };

    const onMouseLeave = () => {
      state.isOverImage = false;
      state.isMoving = false;
      fluidMaterial.uniforms.uIsMoving.value = false;
      if (idleTimer) clearTimeout(idleTimer);
      stopAutoIfRunning();
    };

    const onMouseMove = (e: MouseEvent) => {
      stopAutoIfRunning();

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;

      state.prevMouse.copy(state.mouse);
      state.mouse.set(x, y);

      state.isMoving = true;
      fluidMaterial.uniforms.uIsMoving.value = true;

      if (state.idleTimeout) clearTimeout(state.idleTimeout);
      state.idleTimeout = setTimeout(() => {
        state.isMoving = false;
        fluidMaterial.uniforms.uIsMoving.value = false;
      }, CONFIG.IDLE_DELAY);

      if (state.canSwitchImage) {
        const idx = Math.floor(Math.random() * revealTextures.length);
        displayMaterial.uniforms.uTopTexture.value = revealTextures[idx];
        state.canSwitchImage = false;
      }

      startIdleTimer();
    };

    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("mousemove", onMouseMove);

    const halfRes = CONFIG.FLUID_RESOLUTION / 2;

    const resetCheck = setInterval(() => {
      if (state.isMoving || fluidMaterial.uniforms.uIsMoving.value) return;

      gl.setRenderTarget(state.curr);
      const pixels = new Uint8Array(4);
      gl.readRenderTargetPixels(
        state.curr,
        halfRes,
        halfRes,
        1,
        1,
        pixels
      );
      gl.setRenderTarget(null);

      if (pixels[0] < CONFIG.RESET_THRESHOLD) {
        state.canSwitchImage = true;
      }
    }, CONFIG.RESET_CHECK_INTERVAL);

    // Assume over image on mount for initial auto start
    state.isOverImage = true;
    startIdleTimer();

    return () => {
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("mousemove", onMouseMove);
      clearInterval(resetCheck);
      if (idleTimer) clearTimeout(idleTimer);
      if (state.idleTimeout) clearTimeout(state.idleTimeout);
    };
  }, [gl, fluidMaterial, displayMaterial, revealTextures]);

  useEffect(() => {
    displayMaterial.uniforms.uResolution.value.set(size.width, size.height);
  }, [size, displayMaterial]);

  // ─── Animation loop ─────────────────────────────────────────────────
  useFrame(() => {
    const state = stateRef.current;

    if (autoActive.current && state.isOverImage) {
      const elapsed = performance.now() - autoStartTime.current;
      autoProgress.current = Math.min(elapsed / CONFIG.AUTO_MOVE_DURATION_MS, 1);

      if (autoProgress.current >= 1) {
        autoActive.current = false;
        state.isMoving = false;
        fluidMaterial.uniforms.uIsMoving.value = false;
        // Restart idle timer for next cycle
        startIdleTimerRef.current();
      } else {
        const t = autoProgress.current;

        const x = 0.08 + t * 0.84;

        const waves = 5.5;
        const triangle = Math.abs((t * waves * 2) % 2 - 1);
        const y = 0.15 + triangle * 0.7;

        virtualMousePos.current.set(x, y);

        state.prevMouse.copy(state.mouse);
        state.mouse.copy(virtualMousePos.current);

        state.isMoving = true;
        fluidMaterial.uniforms.uIsMoving.value = true;
      }
    }

    fluidMaterial.uniforms.uPrevTrails.value = state.prev.texture;

    gl.setRenderTarget(state.curr);
    gl.render(fluidScene, fluidCamera);
    gl.setRenderTarget(null);

    displayMaterial.uniforms.uFluid.value = state.curr.texture;

    [state.curr, state.prev] = [state.prev, state.curr];
  });

  return (
    <mesh material={displayMaterial}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

/* ===============================================================
   🎯 MAIN COMPONENT
=============================================================== */
export default function FluidStrCanvas() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div 
      className="w-full h-full cursor-pointer"
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, left: -1, right: 1, top: 1, bottom: -1, near: 0, far: 1 }}
        gl={{ 
          alpha: true,
          antialias: false,
          powerPreference: "high-performance"
        }}
        onCreated={() => setIsLoaded(true)}
      >
        <FluidScene />
      </Canvas>
    </div>
  );
}