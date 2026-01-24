"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import UpdateCard from "./UpdateCard";
import ContainerLayout from "@/layout/ContainerLayout";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";


import { IoIosArrowRoundBack as ArrowLeft, IoIosArrowRoundForward  as ArrowRight } from "react-icons/io";


import gsap from "gsap";

const updates = [
  {
    img: "/update1.jpg",
    title: "arasan shooting resumes",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    img: "/update2.jpg",
    title: "Living in the process",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    img: "/update3.jpg",
    title: "Creative flow",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    img: "/update4.jpg",
    title: "Behind the scenes",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const POSITIONS = {
  LEFT: { x: -360, scale: 0.85, opacity: 1, z: 1 },
  CENTER: { x: 0, scale: 1, opacity: 1, z: 5 },
  RIGHT: { x: 360, scale: 0.85, opacity: 1, z: 1 },
};

const LatestUpdates = () => {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [center, setCenter] = useState(1);

  const getIndex = (offset: number) =>
    (center + offset + updates.length) % updates.length;

  const animate = () => {
    const left = getIndex(-1);
    const mid = center;
    const right = getIndex(1);

    cardsRef.current.forEach((card, i) => {
      let pos = null;

      if (i === left) pos = POSITIONS.LEFT;
      if (i === mid) pos = POSITIONS.CENTER;
      if (i === right) pos = POSITIONS.RIGHT;

      if (!pos) {
        gsap.set(card, { opacity: 0, scale: 0.7 });
        return;
      }

      gsap.to(card, {
        x: pos.x,
        scale: pos.scale,
        opacity: pos.opacity,
        zIndex: pos.z,
        duration: 0.6,
        ease: "power3.out",
      });
    });
  };

  useLayoutEffect(() => {
    animate();
  }, [center]);

  return (
    <section className="light py-20 overflow-hidden">
      <ContainerLayout className="min-h-screen flex flex-col items-center  gap-12">
        <h1 className="text-4xl md:text-6xl text-center">
          What&apos;s Happening Now
        </h1>

        {/* Carousel */}
        <div className="relative w-full h-[75dvh] flex items-center justify-center ">
          {updates.map((item, idx) => (
            <div
              key={idx}
              ref={(el) => {
                if (el) cardsRef.current[idx] = el;
              }}
              className="absolute w-[320px] md:w-[360px] "
            >
              <UpdateCard
                {...item}
                isActive={idx === center}
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <div className="flex gap-6 text-primary">
          <button
            onClick={() =>
              setCenter((c) => (c - 1 + updates.length) % updates.length)
            }
            className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black transition cursor-pointer"
          >
            <ArrowLeft size={26} />
          </button>

          <button
            onClick={() =>
              setCenter((c) => (c + 1) % updates.length)
            }
            className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black transition cursor-pointer"
          >
            <ArrowRight size={26} />
          </button>
        </div>
      </ContainerLayout>
    </section>
  );
};

export default LatestUpdates;
