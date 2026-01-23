"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { forwardRef } from "react";
import { AudioWave } from "./AudioWave";

const Navbar = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLUListElement>(null);
  const imagesRef = useRef<HTMLDivElement[]>([]);

  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const colLeft = useRef<HTMLDivElement[]>([]);
  const colRight = useRef<HTMLDivElement[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isLightSection, setIsLightSection] = useState(false);

  const toggleAudio = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Audio playback failed:", error);
        setIsPlaying(false);
      }
    }
  };

  const menuLinks = [
    { title: "Home", slug: "/" },
    { title: "About", slug: "/about" },
    { title: "Press Desk", slug: "/press" },
    { title: "Merch Store", slug: "/" },
    { title: "Membership", slug: "/membership" },
    { title: "Musical Journey", slug: "/music-journey" },
    { title: "Contact", slug: "/contact" },
  ];

  const menuImages = [
    "/menu/str1.jpg",
    "/menu/str2.jpg",
    "/menu/str3.jpg",
    "/menu/car.png",
  ];

  /* INITIAL STATE  */
  useEffect(() => {
    if (!overlayRef.current) return;

    gsap.set(overlayRef.current, {
      clipPath: "circle(0px at 0px 0px)",
      pointerEvents: "none",
      visibility: "hidden",
    });

    gsap.set(closeBtnRef.current, {
      scale: 0,
      rotate: -90,
      opacity: 0,
    });
  }, []);

  const getSectionUnderNavbar = () => {
    const nav = document.querySelector("nav");
    const sections = document.querySelectorAll("section");

    if (!nav) return false;

    const y = nav.getBoundingClientRect().bottom + 1;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();

      if (rect.top <= y && rect.bottom > y) {
        return section.classList.contains("light");
      }
    }

    return false;
  };

  useEffect(() => {
    const update = () => {
      setIsLightSection(getSectionUnderNavbar());
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const handleLoad = () => {
      setIsLightSection(getSectionUnderNavbar());
    };

    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  /*  OPEN  */
  const openMenu = () => {
    if (!menuBtnRef.current || !overlayRef.current) return;
    setMenuOpen(true);

    const rect = menuBtnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const tl = gsap.timeline();

    // reset clip-path origin every time
    gsap.set(overlayRef.current, {
      clipPath: `circle(0px at ${cx}px ${cy}px)`,
      visibility: "visible",
      pointerEvents: "auto",
    });

    tl.to(menuBtnRef.current, {
      scale: 0,
      rotate: 90,
      duration: 0.25,
      ease: "power3.in",
    })
      .to(
        closeBtnRef.current,
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
        },
        "-=0.1",
      )
      .to(
        overlayRef.current,
        {
          clipPath: `circle(150vmax at ${cx}px ${cy}px)`,
          duration: 1,
          ease: "power4.inOut",
        },
        0,
      )
      .fromTo(
        imagesRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4",
      )
      .fromTo(
        menuItemsRef.current?.children || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.5",
      );
  };

  /* ================= CLOSE ================= */
  const closeMenu = () => {
    if (!menuBtnRef.current || !overlayRef.current) return;
    setMenuOpen(false);

    const rect = menuBtnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const tl = gsap.timeline();

    tl.to(menuItemsRef.current?.children || [], {
      y: 40,
      opacity: 0,
      stagger: 0.05,
      duration: 0.3,
      ease: "power3.in",
    })

      .to(imagesRef.current, {
        opacity: 0,
        scale: 0.9,
        stagger: 0.05,
        duration: 0.1,
      })

      // CIRCLE COLLAPSE
      .to(overlayRef.current, {
        clipPath: `circle(0px at ${cx}px ${cy}px)`,
        duration: 0.8,
        ease: "power4.inOut",
      })

      // CLOSE → MENU
      .to(
        closeBtnRef.current,
        {
          scale: 0,
          rotate: -90,
          opacity: 0,
          duration: 0.3,
          ease: "power3.in",
        },
        "-=0.3",
      )

      .to(
        menuBtnRef.current,
        {
          scale: 1,
          rotate: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
        },
        "-=0.1",
      )

      .set(overlayRef.current, {
        pointerEvents: "none",
        visibility: "hidden",
      });
  };

  useEffect(() => {
    if (!menuOpen) return;
    if (!overlayRef.current) return;
    if (!colLeft.current.length || !colRight.current.length) return;

    const overlay = overlayRef.current;

    const leftY = gsap.quickTo(colLeft.current, "y", {
      duration: 1.2,
      ease: "power3.out",
    });

    const rightY = gsap.quickTo(colRight.current, "y", {
      duration: 1.2,
      ease: "power3.out",
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = overlay.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;

      const normalizedY = (e.clientY - centerY) / (rect.height / 2);
      const clamped = gsap.utils.clamp(-1, 1, normalizedY);
      const movement = clamped * 45;

      leftY(-movement);
      rightY(movement);
    };

    overlay.addEventListener("mousemove", handleMouseMove);

    return () => {
      overlay.removeEventListener("mousemove", handleMouseMove);
    };
  }, [menuOpen]);

  useEffect(() => {
    gsap.to(colLeft.current, {
      y: "+=10",
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(colRight.current, {
      y: "-=10",
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-999 px-6 py-4 flex justify-between items-center overflow-hidden w-full">
        <Link href="/">
          <Image
            src="/logo/logo.png"
            alt="STR Logo"
            width={120}
            height={50}
            className={`
        w-[90px] md:w-[120px]
        transition-all duration-300
        ${isLightSection ? "invert" : "invert-0"}
      `}
          />
        </Link>

        <audio
          ref={audioRef}
          preload="metadata"
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false);
          }}
        >
          <source src="/Loosu-Penne-song.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        <div className=" flex gap-4 items-center">
          <button
            onClick={toggleAudio}
            className="group flex flex-col items-center gap-2 cursor-pointer"
          >
            <AudioWave isPlaying={isPlaying} isLightSection={isLightSection} />

            <p className="text-xs md:text-base tracking-wide">
              <span className={isPlaying ? "text-green-500" : "text-white"}>
                AUDIO
              </span>{" "}
              <span className={` ${isPlaying ? "text-green-500" : "text-white"} font-bold`}>{isPlaying ? "ON" : "OFF"}</span>
            </p>
          </button>

          <button className="bg-green-500 hover:bg-green-600 text-black  py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base">
            <Image
              src="/shopicon.png"
              alt="Store"
              width={18}
              height={18}
              className="object-contain w-[15px] md:w-[18px]"
            />
            STORE
          </button>
          <button
            ref={menuBtnRef}
            onClick={openMenu}
            className=" cursor-pointer"
          >
            <Image src="/menuicon.png" alt="Menu" width={32} height={32} />
          </button>
        </div>
      </nav>

      {/* OVERLAY  */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-9999 bg-primary text-white
             invisible pointer-events-none"
      >
        <button
          ref={closeBtnRef}
          onClick={closeMenu}
          className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white text-black font-bold flex items-center justify-center cursor-pointer"
        >
          ✕
        </button>

        <div className="flex h-full">
          {/* IMAGES */}
          <div
            className="hidden md:grid w-full md:w-[45%] xl:w-[45%]
 gap-x-6 grid-cols-2 gap-y-8 overflow-y-hidden mx-auto px-10"
          >
            {menuImages.map((src, i) => {
              const isLeftColumn = i % 2 === 0;

              return (
                <div
                  key={i}
                  ref={(el) => {
                    if (!el) return;

                    imagesRef.current[i] = el;

                    if (isLeftColumn) {
                      colLeft.current[Math.floor(i / 2)] = el;
                    } else {
                      colRight.current[Math.floor(i / 2)] = el;
                    }
                  }}
                  className="relative overflow-hidden aspect-3/4 will-change-transform translate-y-2 xl:w-[17dvw] xl:h-[66vdh]"
                >
                  <Image
                    src={src}
                    alt=""
                    width={500}
                    height={500}
                    className="object-cover object-center transition-transform duration-700 ease-out grayscale hover:grayscale-0 hover:scale-105 xl:w-[17dvw] xl:h-[66dvh]"
                  />
                </div>
              );
            })}
          </div>

          {/* LINKS */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <ul
              ref={menuItemsRef}
              className="flex flex-col  text-4xl lg:text-5xl 2xl:text-6xl py-6 font-bold text-center"
            >
              {menuLinks.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.slug}
                    onClick={closeMenu}
                    className="relative inline-block overflow-hidden group uppercase"
                  >
                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                      {item.title}
                    </span>
                    <span className="absolute left-0 top-full block text-green-950 transition-transform duration-300 group-hover:-translate-y-full">
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
