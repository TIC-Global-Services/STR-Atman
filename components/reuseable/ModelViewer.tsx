"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Stage, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* =========================================================
   TYPES
========================================================= */
type Vec3 = [number, number, number];

interface ModelProps {
  url: string;
  position?: Vec3;
  rotation?: Vec3;
  scale?: number | Vec3;
}

interface ModelViewerProps {
  modelUrl: string;
  modelPosition?: Vec3;
  modelRotation?: Vec3;
  modelScale?: number | Vec3;

  cameraPosition?: Vec3;
  cameraFov?: number;

  environmentPreset?:
    | "sunset"
    | "dawn"
    | "night"
    | "warehouse"
    | "forest"
    | "studio"
    | "apartment"
    | "city";

  enableControls?: boolean;
  useStage?: boolean;
  className?: string;
}

/* =========================================================
   PARALLAX GROUP (MOUSE INTERACTION)
========================================================= */
const ParallaxGroup: React.FC<{
  intensity?: number; // overall strength
  xIntensity?: number; // horizontal control
  yIntensity?: number; // vertical control
  ease?: number; // smoothness
  children: React.ReactNode;
}> = ({
  children,
  intensity = 1,
  xIntensity = 0.4,
  yIntensity = 0.3,
  ease = 0.08,
}) => {
  const ref = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame(() => {
    if (!ref.current) return;

    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      mouse.x * xIntensity * intensity,
      ease,
    );

    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -mouse.y * yIntensity * intensity,
      ease,
    );
  });

  return <group ref={ref}>{children}</group>;
};

const ShineAnimator: React.FC<{ speed?: number }> = ({ speed = 0.02 }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;

    ref.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const material = (child as THREE.Mesh)
          .material as THREE.MeshStandardMaterial;

        // ✨ Pulsing shine
        material.emissiveIntensity = 0.12 + Math.sin(Date.now() * speed) * 0.05;

        material.roughness = 0.28 + Math.sin(Date.now() * speed * 0.8) * 0.05;
      }
    });
  });

  return <group ref={ref} />;
};

/* =========================================================
   MODEL
========================================================= */
const Model: React.FC<ModelProps> = ({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const { scene } = useGLTF(url) as { scene: THREE.Group };

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const material = mesh.material as THREE.MeshStandardMaterial;

        // 🔥 SHINE SETTINGS (KEY PART)
        material.metalness = 0.85; // how metallic
        material.roughness = 0.25; // lower = shinier
        material.envMapIntensity = 2; // reflection strength

        // ✨ EMISSIVE GLOW (very subtle)
        material.emissive = new THREE.Color("#ffffff");
        material.emissiveIntensity = 0.15;

        material.needsUpdate = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
};

/* =========================================================
   MODEL VIEWER
========================================================= */
const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  modelPosition = [0, 0, 0],
  modelRotation = [0, 0, 0],
  modelScale = 1,

  cameraPosition = [0, 4, 12],
  cameraFov = 35,

  environmentPreset = "studio",

  enableControls = false,
  useStage = true,

  className = "w-full h-full",
}) => {
  return (
    <div className={className}>
      <Canvas
        className="w-full h-full"
        shadows
        camera={{
          position: cameraPosition,
          fov: cameraFov,
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />

          <Environment preset={environmentPreset} />

          {useStage ? (
            <Stage intensity={1} environment={environmentPreset}>
              <ParallaxGroup intensity={0.1}>
                <ShineAnimator speed={0.0025} />
                <Model
                  url={modelUrl}
                  position={modelPosition}
                  rotation={modelRotation}
                  scale={modelScale}
                />
              </ParallaxGroup>
            </Stage>
          ) : (
            <ParallaxGroup intensity={0.1}>
              <ShineAnimator speed={0.0025} />
              <Model
                url={modelUrl}
                position={modelPosition}
                rotation={modelRotation}
                scale={modelScale}
              />
            </ParallaxGroup>
          )}

          {enableControls && <OrbitControls />}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer;

/* Preload */
useGLTF.preload("/glb/str.glb");
