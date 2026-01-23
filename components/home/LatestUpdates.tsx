"use client";

import React, { useLayoutEffect, useRef } from "react";
import UpdateCard from "./UpdateCard";
import ContainerLayout from "@/layout/ContainerLayout";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight as RightArrow } from "react-icons/md";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const updates = [
  {
    img: "/update1.jpg",
    title: "arasan shooting resumes",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    slug: "/",
  },
  {
    img: "/update2.jpg",
    title: "Living in the process",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    slug: "/",
  },
  {
    img: "/update3.jpg",
    title: "Living in the process",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    slug: "/",
  },
];

const LatestUpdates = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top top+=50",
          scrub: true,
        },
      });

      tl.from(sectionRef.current, {
        opacity: 0,
        y: 80,
        ease: "none",
      });

      tl.from(
        cardsRef.current,
        {
          opacity: 0,
          y: 60,
          stagger: 0.15,
          ease: "none",
        },
        "<",
      );

      tl.from(
        linkRef.current,
        {
          opacity: 0,
          y: 20,
          ease: "none",
        },
        "<+=0.2",
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className=" light">
      {/* ✅ wrapper div holds the ref */}
      <ContainerLayout className=" lxl:min-h-screen w-full py-20 space-y-10">
        <h1 className="text-5xl">What&apos;s Happening Now</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {updates.map((update, idx) => (
            <div
              key={idx}
              ref={(el) => {
                if (el) cardsRef.current[idx] = el;
              }}
            >
              <UpdateCard {...update} />
            </div>
          ))}
        </div>

        <Link
          ref={linkRef}
          href="#"
          className="flex items-center gap-2 text-lg text-[#707070]"
        >
          View More <RightArrow size={22} />
        </Link>
      </ContainerLayout>
    </section>
  );
};

export default LatestUpdates;
