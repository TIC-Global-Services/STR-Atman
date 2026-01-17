
"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TopographicTexture = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const settings = [
    { name: 'contourInterval', value: 12.0 },
    { name: 'lineThickness', value: 0.012 },
    { name: 'bgColor', value: [0.93, 0.93, 0.93] },
    { name: 'lineColor', value: [0.60, 0.60, 0.60] },
    { name: 'alpha', value: 1.0 },
    { name: 'uvScale', value: 1.5 },
    { name: 'timeScale', value: 0.05 }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.OrthographicCamera(
      -1, 1, 1, -1, 0.1, 10
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

    const additionalUniforms: Record<string, { value: number | THREE.Vector3 }> = {};
    settings.forEach(s => {
      if (Array.isArray(s.value)) {
        additionalUniforms[s.name] = { value: new THREE.Vector3(...s.value) };
      } else {
        additionalUniforms[s.name] = { value: s.value };
      }
    });

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      ...additionalUniforms
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform float contourInterval;
        uniform float lineThickness;
        uniform vec3 bgColor;
        uniform vec3 lineColor;
        uniform float alpha;
        uniform float uvScale;
        uniform float timeScale;
        varying vec2 vUv;
        
        // Simplex noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          vec2 uv = vUv;
          vec2 p = uv * uvScale;

          float t = time * timeScale;
          
          // Build smooth, organic terrain with fewer octaves
          float elevation = 0.0;
          
          // Very large smooth features
          elevation += snoise(p * 0.3 + vec2(t * 0.5, t * 0.7)) * 5.0;
          elevation += snoise(p * 0.5 + vec2(-t * 0.3, t * 0.4)) * 3.5;
          
          // Medium smooth features
          elevation += snoise(p * 0.8 + vec2(t * 0.4, -t * 0.2)) * 2.0;
          
          // Minimal detail for smoothness
          elevation += snoise(p * 1.2 + vec2(-t * 0.15, t * 0.25)) * 1.0;
          
          // Create contour lines with very big gaps
          float contour = fract(elevation / contourInterval);

          // Draw thin, clean lines
          float line = smoothstep(0.5 - lineThickness, 0.5, contour) -
                       smoothstep(0.5, 0.5 + lineThickness, contour);

          // Colors - more gray
          vec3 color = mix(bgColor, lineColor, line);

          gl_FragColor = vec4(color, alpha);
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    
    const animate = () => {
      material.uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        zIndex: -1
      }}
    />
  );
};

export default TopographicTexture;