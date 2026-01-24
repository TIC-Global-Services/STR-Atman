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
  ],
  
  // Timing
  IDLE_DELAY: 1500,
  RETURN_SPEED: 0.88,
  RESET_CHECK_INTERVAL: 100,
  RESET_THRESHOLD: 5,
  
  // Fluid behavior
  ACTIVE_DECAY: 0.965,
  TRAIL_WIDTH: 0.08,
  TRAIL_INTENSITY: 0.6,
  REVEAL_SMOOTHNESS: 0.02,
  REVEAL_TRANSITION: 0.12,
  
  // Rendering
  FLUID_RESOLUTION: 512,
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
  
  // Load textures
  const baseTexture = useTexture(CONFIG.BASE_IMAGE);
  const revealTextures = useTexture(CONFIG.REVEAL_IMAGES);
  
  // Render targets for fluid simulation
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
  
  // Get texture sizes
  const textureSizes = useMemo(() => {
    return {
      baseSize: new THREE.Vector2(
        (baseTexture.image as HTMLImageElement)?.width || 1920,
        (baseTexture.image as HTMLImageElement)?.height || 1080
      ),
      revealSize: new THREE.Vector2(
        (revealTextures[0].image as HTMLImageElement)?.width || 1920,
        (revealTextures[0].image as HTMLImageElement)?.height || 1080
      ),
    };
  }, [baseTexture, revealTextures]);
  
  // Fluid material
  const fluidMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: fluidFragmentShader,
      uniforms: {
        uPrevTrails: { value: stateRef.current.prev.texture },
        uMouse: { value: stateRef.current.mouse },
        uPrevMouse: { value: stateRef.current.prevMouse },
        uDecay: { value: CONFIG.ACTIVE_DECAY },
        uIdleDecay: { value: CONFIG.RETURN_SPEED },
        uIsMoving: { value: false },
        uTrailWidth: { value: CONFIG.TRAIL_WIDTH },
        uTrailIntensity: { value: CONFIG.TRAIL_INTENSITY },
      },
    });
  }, []);
  
  // Display material
  const displayMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: displayFragmentShader,
      uniforms: {
        uFluid: { value: stateRef.current.curr.texture },
        uBottomTexture: { value: baseTexture },
        uTopTexture: { value: revealTextures[0] },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uTopTexSize: { value: textureSizes.revealSize },
        uBottomTexSize: { value: textureSizes.baseSize },
        uRevealSmooth: { value: CONFIG.REVEAL_SMOOTHNESS },
        uRevealTransition: { value: CONFIG.REVEAL_TRANSITION },
      },
      transparent: true,
    });
  }, [baseTexture, revealTextures, size, textureSizes]);
  
  // Fluid simulation scene - initialize once
  const fluidScene = useMemo(() => {
    const scene = new THREE.Scene();
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fluidMaterial);
    scene.add(mesh);
    return scene;
  }, [fluidMaterial]);
  
  const fluidCamera = useMemo(() => {
    return new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }, []);
  
  // Mouse interaction
  useEffect(() => {
    const canvas = gl.domElement;
    const state = stateRef.current;
    
    const handleMouseEnter = () => {
      state.isOverImage = true;
    };
    
    const handleMouseLeave = () => {
      state.isOverImage = false;
      state.isMoving = false;
      fluidMaterial.uniforms.uIsMoving.value = false;
      if (state.idleTimeout) clearTimeout(state.idleTimeout);
    };
    
    const handleMouseMove = (e: MouseEvent): void => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      
      // Update previous mouse before setting new position
      state.prevMouse.copy(state.mouse);
      state.mouse.set(x, y);
      
      state.isMoving = true;
      fluidMaterial.uniforms.uIsMoving.value = true;
      
      if (state.idleTimeout) clearTimeout(state.idleTimeout);
      
      // Switch image only if allowed
      if (state.canSwitchImage) {
        state.revealIndex = Math.floor(Math.random() * revealTextures.length);
        displayMaterial.uniforms.uTopTexture.value = revealTextures[state.revealIndex];
        state.canSwitchImage = false;
      }
      
      state.idleTimeout = setTimeout(() => {
        state.isMoving = false;
        fluidMaterial.uniforms.uIsMoving.value = false;
      }, CONFIG.IDLE_DELAY);
    };
    
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousemove", handleMouseMove);
    
    // Check for reset
    const checkResetInterval = setInterval(() => {
      if (!state.isMoving && !fluidMaterial.uniforms.uIsMoving.value) {
        gl.setRenderTarget(state.curr);
        const pixels = new Uint8Array(4);
        gl.readRenderTargetPixels(
          state.curr,
          CONFIG.FLUID_RESOLUTION / 2,
          CONFIG.FLUID_RESOLUTION / 2,
          1,
          1,
          pixels
        );
        gl.setRenderTarget(null);
        
        if (pixels[0] < CONFIG.RESET_THRESHOLD) {
          state.canSwitchImage = true;
        }
      }
    }, CONFIG.RESET_CHECK_INTERVAL);
    
    return () => {
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(checkResetInterval);
      if (state.idleTimeout) clearTimeout(state.idleTimeout);
    };
  }, [gl, fluidMaterial, displayMaterial, revealTextures]);
  
  // Update resolution on resize
  useEffect(() => {
    displayMaterial.uniforms.uResolution.value.set(size.width, size.height);
  }, [size, displayMaterial]);
  
  // Animation loop
  useFrame(() => {
    const state = stateRef.current;
    
    // Render fluid simulation
    fluidMaterial.uniforms.uPrevTrails.value = state.prev.texture;
    
    gl.setRenderTarget(state.curr);
    gl.render(fluidScene, fluidCamera);
    gl.setRenderTarget(null);
    
    // Update display
    displayMaterial.uniforms.uFluid.value = state.curr.texture;
    
    // Swap buffers
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