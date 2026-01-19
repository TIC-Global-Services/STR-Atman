"use client";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  vertexShader,
  fluidFragmentShader,
  displayFragmentShader,
} from "@/utils/shaders";
import ContourBackground from "../reuseable/ContourBackground";
const topimage = "/landonorriswithouthelmet.png";
const bottomimage = "/landonorriswithhelmet.png";

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const textParallaxRef1 = useRef<HTMLDivElement>(null);
  const textParallaxRef2 = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      precision: "highp",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const size = 500;
    const pingPongTargets = [
      new THREE.WebGLRenderTarget(size, size, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }),
      new THREE.WebGLRenderTarget(size, size, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }),
    ];

    // Helper function to create placeholder texture
    const createPlaceholderTexture = (color: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // Function to load images and set textures
    const loadImage = (
      url: string,
      targetTexture: { value: THREE.Texture },
      textureSizeVector: THREE.Vector2
    ) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        const originalWidth = img.width;
        const originalHeight = img.height;
        const maxSize = 4096;
        let newWidth = originalWidth;
        let newHeight = originalHeight;

        if (originalWidth > maxSize || originalHeight > maxSize) {
          console.log(`Image exceeds max texture size, resizing...`);
          if (originalWidth > originalHeight) {
            newWidth = maxSize;
            newHeight = Math.floor(originalHeight * (maxSize / originalWidth));
          } else {
            newHeight = maxSize;
            newWidth = Math.floor(originalWidth * (maxSize / originalHeight));
          }
        }
        textureSizeVector.set(newWidth, newHeight);
        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
        }
        const newTexture = new THREE.CanvasTexture(canvas);
        newTexture.minFilter = THREE.LinearFilter;
        newTexture.magFilter = THREE.LinearFilter;
        targetTexture.value = newTexture;
      };
      img.onerror = function (err) {
        console.error(`Error loading image ${url}:`, err);
      };
      img.src = url;
    };

    const topTexture = createPlaceholderTexture("#0000FF");
    const bottomTexture = createPlaceholderTexture("#ff0000");
    const topTextureSize = new THREE.Vector2(1, 1);
    const bottomTextureSize = new THREE.Vector2(1, 1);

    const topTextureUniform = { value: topTexture };
    const bottomTextureUniform = { value: bottomTexture };

    const mouse = new THREE.Vector2(0, 0);
    const prevMouse = new THREE.Vector2(0, 0);

    // Fluid simulation material
    const trailsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPrevTrails: { value: null },
        uMouse: { value: mouse },
        uPrevMouse: { value: prevMouse },
        uResolution: { value: new THREE.Vector2(size, size) },
        uDecay: { value: 0.9 },
        uIsMoving: { value: false },
      },
      vertexShader,
      fragmentShader: fluidFragmentShader,
    });

    const displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uFluid: { value: null },
        uTopTexture: topTextureUniform,
        uBottomTexture: bottomTextureUniform,
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uDpr: { value: window.devicePixelRatio },
        uTopTextureSize: { value: topTextureSize },
        uBottomTextureSize: { value: bottomTextureSize },
      },
      vertexShader,
      fragmentShader: displayFragmentShader,
    });

    loadImage(topimage, topTextureUniform, topTextureSize);
    loadImage(bottomimage, bottomTextureUniform, bottomTextureSize);
    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const displayMesh = new THREE.Mesh(planeGeometry, displayMaterial);
    scene.add(displayMesh);
    const simMesh = new THREE.Mesh(planeGeometry, trailsMaterial);
    const simScene = new THREE.Scene();
    simScene.add(simMesh);

    renderer.setRenderTarget(pingPongTargets[0]);
    renderer.clear();
    renderer.setRenderTarget(pingPongTargets[1]);
    renderer.clear();
    renderer.setRenderTarget(null);

    let isMoving = false;
    let lastMoveTime = 0;

    // Event handlers
    const onMouseMove = (event: MouseEvent) => {
      const canvasRect = (canvas as HTMLCanvasElement).getBoundingClientRect();
      if (
        event.clientX >= canvasRect.left &&
        event.clientX <= canvasRect.right &&
        event.clientY >= canvasRect.top &&
        event.clientY <= canvasRect.bottom
      ) {
        prevMouse.copy(mouse);
        mouse.x = (event.clientX - canvasRect.left) / canvasRect.width;
        mouse.y = 1 - (event.clientY - canvasRect.top) / canvasRect.height;
        isMoving = true;
        lastMoveTime = performance.now();
      } else {
        isMoving = false;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        event.preventDefault();
        const canvasRect = (
          canvas as HTMLCanvasElement
        ).getBoundingClientRect();
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;

        if (
          touchX >= canvasRect.left &&
          touchX <= canvasRect.right &&
          touchY >= canvasRect.top &&
          touchY <= canvasRect.bottom
        ) {
          prevMouse.copy(mouse);
          mouse.x = (touchX - canvasRect.left) / canvasRect.width;
          mouse.y = 1 - (touchY - canvasRect.top) / canvasRect.height;
          isMoving = true;
          lastMoveTime = performance.now();
        } else {
          isMoving = false;
        }
      }
    };

    const onWindowResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      displayMaterial.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
      displayMaterial.uniforms.uDpr.value = window.devicePixelRatio;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", onWindowResize);

    let currentTarget = 0;

    // Animation loop (ping-pong render targets)
    const animate = () => {
      requestAnimationFrame(animate);

      if (isMoving && performance.now() - lastMoveTime > 50) {
        isMoving = false;
      }

      const prevTarget = pingPongTargets[currentTarget];
      currentTarget = (currentTarget + 1) % 2;
      const currentRenderTarget = pingPongTargets[currentTarget];

      trailsMaterial.uniforms.uPrevTrails.value = prevTarget.texture;
      trailsMaterial.uniforms.uMouse.value.copy(mouse);
      trailsMaterial.uniforms.uPrevMouse.value.copy(prevMouse);
      trailsMaterial.uniforms.uIsMoving.value = isMoving;

      renderer.setRenderTarget(currentRenderTarget);
      renderer.render(simScene, camera);

      displayMaterial.uniforms.uFluid.value = currentRenderTarget.texture;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);
  useEffect(() => {
    const element = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: "top top",
          end: "+=1200",
          scrub: true,
        },
      });
      tl.to(heroRef.current, {
        scale: 0.3,
        filter: "grayscale(1)",
        ease: "none",
      });
    });
    return () => element.revert();
  }, []);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const text1Element = textParallaxRef1.current;
    const text2Element = textParallaxRef2.current;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let isHovering = false;
    const xSetterCanvas = canvasElement
      ? gsap.quickTo(canvasElement, "x", { duration: 2.5, ease: "power2.out" })
      : null;
    const ySetterCanvas = canvasElement
      ? gsap.quickTo(canvasElement, "y", { duration: 2.5, ease: "power2.out" })
      : null;
    const xSetterText1 = text1Element
      ? gsap.quickTo(text1Element, "x", { duration: 2.5, ease: "power2.out" })
      : null;
    const ySetterText1 = text1Element
      ? gsap.quickTo(text1Element, "y", { duration: 2.5, ease: "power2.out" })
      : null;
    const xSetterText2 = text2Element
      ? gsap.quickTo(text2Element, "x", { duration: 2.5, ease: "power2.out" })
      : null;
    const ySetterText2 = text2Element
      ? gsap.quickTo(text2Element, "y", { duration: 2.5, ease: "power2.out" })
      : null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;
      const deltaX = (e.clientX / window.innerWidth - 0.5) * 50;
      const deltaY = (e.clientY / window.innerHeight - 0.5) * 50;
      if (xSetterCanvas) xSetterCanvas(deltaX);
      if (ySetterCanvas) ySetterCanvas(deltaY);
      if (xSetterText1) xSetterText1(deltaX * 0.5);
      if (ySetterText1) ySetterText1(deltaY * 0.5);
      if (xSetterText2) xSetterText2(deltaX * 0.5);
      if (ySetterText2) ySetterText2(deltaY * 0.5);
    };

    const handleMouseEnter = () => {
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      if (xSetterCanvas) xSetterCanvas(0);
      if (ySetterCanvas) ySetterCanvas(0);
      if (xSetterText1) xSetterText1(0);
      if (ySetterText1) ySetterText1(0);
      if (xSetterText2) xSetterText2(0);
      if (ySetterText2) ySetterText2(0);
    };

    // Attach to the hero container
    const heroContainer = scrollContainerRef.current;
    if (heroContainer) {
      heroContainer.addEventListener("mousemove", handleMouseMove);
      heroContainer.addEventListener("mouseenter", handleMouseEnter);
      heroContainer.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (heroContainer) {
        heroContainer.removeEventListener("mousemove", handleMouseMove);
        heroContainer.removeEventListener("mouseenter", handleMouseEnter);
        heroContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <section
      className=" light h-screen w-full sticky top-16"
      ref={scrollContainerRef}
    >
      <ContourBackground
        background="#ffffff"
        lineColor="#7a825c"
        speed={0.01}
      >
        <div className="h-screen relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute bottom-20 left-0 w-64 h-64  z-1"
          ></canvas>
        </div>
      </ContourBackground>
      {/* <div className="overflow-hidden" ref={textParallaxRef1}>
       <div className=" flex items-center justify-center">
        <div className="moving-text text-9xl font-normal text-gray-200 whitespace-nowrap">
          {"Enaku Maths Varadhu ".repeat(30)}
        </div>
      </div>
      <div className="flex items-center justify-center" ref={textParallaxRef2}>
         <div className="moving-text-reverse text-9xl font-normal text-gray-200 whitespace-nowrap">
          {"yenna Enaku Maths Vandhuchi ".repeat(30)}
        </div>
      </div>
     </div> */}
    </section>
  );
};

export default Hero;
