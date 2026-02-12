"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import AudioWave from "./AudioWave";
import { MenuIcon } from "./MenuIcon";
import MembershipForm from "../membership/MembershipForm";
import { usePathname } from "next/navigation";
import JoinWaitlistForm from "./JoinWaitlist";

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

  const navRef = useRef<HTMLElement | null>(null);
  const lastScrollY = useRef(0);
  const navTween = useRef<gsap.core.Tween | null>(null);

  const [isLightSection, setIsLightSection] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const pathname = usePathname();

  const openMembershipFromMenu = () => {
    if (!menuBtnRef.current) return;

    // Close menu first
    toggleMenu();

    // Open popup AFTER menu close animation
    setTimeout(() => {
      setShowPopup(true);
    }, 700); // match your GSAP close duration
  };

  useEffect(() => {
    const handleGlobalAudio = (e: any) => {
      // If someone else (like music-cta) plays, pause Navbar audio
      if (e.detail.source !== "navbar" && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener("global-audio-play", handleGlobalAudio);
    return () =>
      window.removeEventListener("global-audio-play", handleGlobalAudio);
  }, []);

  // Ensure toggleAudio notifies others when it starts
  const toggleAudio = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          // Notify others to stop before we start
          window.dispatchEvent(
            new CustomEvent("global-audio-play", {
              detail: { source: "navbar" },
            }),
          );

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
    { title: "Merch Store", slug: "/store" },
    { title: "Membership", slug: "/membership" },
    { title: "Musical Journey", slug: "/music-journey" },
    { title: "Contact", slug: "#" },
  ];

  const menuImages = [
    "/STR/Str-2a.png",
    "/menu/str2.jpg",
    "/STR/Str-3a.png",
    "/STR/Str-1a.png",
  ];

  // INITIAL STATE
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

  const updateLightSection = () => {
    requestAnimationFrame(() => {
      const isLight = getSectionUnderNavbar();
      setIsLightSection(isLight);
    });
  };

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
    const onUpdate = () => updateLightSection();

    window.addEventListener("scroll", onUpdate, { passive: true });
    window.addEventListener("resize", onUpdate);

    return () => {
      window.removeEventListener("scroll", onUpdate);
      window.removeEventListener("resize", onUpdate);
    };
  }, []);

  useEffect(() => {
    // Run immediately on route change
    updateLightSection();

    // Run again after layout/images settle on new page
    const t1 = setTimeout(updateLightSection, 50);
    const t2 = setTimeout(updateLightSection, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  const toggleMenu = () => {
    if (!menuBtnRef.current || !overlayRef.current) return;

    const rect = menuBtnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    if (!menuOpen) {
      setMenuOpen(true);

      gsap.set(overlayRef.current, {
        clipPath: `circle(0px at ${cx}px ${cy}px)`,
        visibility: "visible",
        pointerEvents: "auto",
      });

      gsap.to(overlayRef.current, {
        clipPath: `circle(150vmax at ${cx}px ${cy}px)`,
        duration: 1,
        ease: "power4.inOut",
      });

      gsap.fromTo(
        menuItemsRef.current?.children || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.4,
        },
      );

      // Animate close button appearance
      gsap.to(closeBtnRef.current, {
        scale: 1,
        rotate: 0,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: 0.3,
      });
    } else {
      setMenuOpen(false);

      gsap.to(menuItemsRef.current?.children || [], {
        y: 40,
        opacity: 0,
        stagger: 0.05,
        duration: 0.3,
        ease: "power3.in",
      });

      gsap.to(overlayRef.current, {
        clipPath: `circle(0px at ${cx}px ${cy}px)`,
        duration: 0.8,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(overlayRef.current, {
            pointerEvents: "none",
            visibility: "hidden",
          });

          updateLightSection();
        },
      });

      // Hide close button
      gsap.to(closeBtnRef.current, {
        scale: 0,
        rotate: -90,
        opacity: 0,
        duration: 0.4,
      });
    }
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

  useEffect(() => {
    if (!navRef.current) return;

    const showNav = () => {
      navTween.current?.kill();
      navTween.current = gsap.to(navRef.current, {
        y: 0,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const hideNav = () => {
      navTween.current?.kill();
      navTween.current = gsap.to(navRef.current, {
        y: "-110%",
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const onScroll = () => {
      if (menuOpen) return; // Don't auto-hide when menu is open

      const currentScrollY = window.scrollY;

      // Always show at top
      if (currentScrollY <= 10) {
        showNav();
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY.current) {
        // scrolling down
        hideNav();
      } else {
        // scrolling up
        showNav();
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [menuOpen]);

  return (
    <>
      {/* NAVBAR */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-2 md:px-6 py-4 flex justify-between items-center overflow-x-hidden w-full will-change-transform"
      >
        <Link
          href="/"
          className={`
              font-velcan text-2xl md:text-3xl
              transition-all duration-300 px-3
              ${isLightSection ? "invert-0" : "invert"}
            `}
        >
          Silambarasan TR
        </Link>

        <audio
          ref={audioRef}
          preload="metadata"
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
        >
          <source src="/Loosu-Penne-song.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        <div className="flex gap-4 items-center">
          <button
            onClick={toggleAudio}
            className="group flex flex-col items-center justify-center mx-auto gap-2 cursor-pointer"
          >
            <AudioWave isPlaying={isPlaying} isLightSection={isLightSection} />

            <p className="text-[10px] md:text-sm tracking-wide">
              <span
                className={
                  isPlaying
                    ? "text-primary"
                    : isLightSection
                      ? "text-black"
                      : "text-white"
                }
              >
                AUDIO
              </span>{" "}
              <span
                className={`font-bold ${
                  isPlaying
                    ? "text-primary"
                    : isLightSection
                      ? "text-black"
                      : "text-white"
                }`}
              >
                {isPlaying ? "ON" : "OFF"}
              </span>
            </p>
          </button>

          <Link
            href={"/store"}
            className=" hidden md:flex bg-green-500 hover:bg-green-600 text-black py-2 px-4 rounded-md transition-colors duration-200  items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
          >
            <Image
              src="/shopicon.png"
              alt="Store"
              width={18}
              height={18}
              className="object-contain w-[15px] md:w-[18px]"
            />
            STORE
          </Link>

          <MenuIcon ref={menuBtnRef} isOpen={menuOpen} onClick={toggleMenu} />
        </div>
      </nav>

      <MembershipForm
        showPopup={showPopup}
        onClose={() => setShowPopup(false)}
      />

      {/* OVERLAY */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] bg-primary text-white invisible pointer-events-none"
      >
        <button
          ref={closeBtnRef}
          onClick={toggleMenu}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white rounded-xl z-100 cursor-pointer"
        >
          <span className="absolute w-5 h-[2px] bg-black rounded-full rotate-45" />
          <span className="absolute w-5 h-[2px] bg-black rounded-full -rotate-45" />
        </button>

        <div className="flex h-full">
          {/* IMAGES */}
          <div className="hidden md:grid w-full md:w-[45%] xl:w-[45%] gap-x-6 grid-cols-2 gap-y-8 overflow-y-hidden mx-auto px-10">
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
                  className="relative overflow-hidden aspect-3/4 will-change-transform translate-y-2 "
                >
                  <Image
                    src={src}
                    alt=""
                    width={500}
                    height={500}
                    className="object-contain  transition-transform duration-700 ease-out grayscale hover:grayscale-0 hover:scale-105 xl:w-[17dvw] xl:h-[66dvh]"
                  />
                </div>
              );
            })}
          </div>

          {/* LINKS */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <ul
              ref={menuItemsRef}
              className="flex flex-col text-4xl lg:text-5xl 2xl:text-6xl py-6 font-bold text-center"
            >
              {menuLinks.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.slug}
                    onClick={(e) => {
                      if (item.title === "Contact") {
                        e.preventDefault();
                        openMembershipFromMenu();
                      } else {
                        toggleMenu();
                      }
                    }}
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
