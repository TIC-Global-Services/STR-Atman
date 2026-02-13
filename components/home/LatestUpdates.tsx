"use client";

import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import UpdateCard from "./UpdateCard";
import ContainerLayout from "@/layout/ContainerLayout";
import { IoIosArrowRoundBack as ArrowLeft, IoIosArrowRoundForward as ArrowRight } from "react-icons/io";
import gsap from "gsap";

const POSITIONS = {
  LEFT: { x: -360, scale: 0.85, opacity: 1, z: 1 },
  CENTER: { x: 0, scale: 1, opacity: 1, z: 5 },
  RIGHT: { x: 360, scale: 0.85, opacity: 1, z: 1 },
};

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  summary: string;
}

const LatestUpdates = () => {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [updates, setUpdates] = useState<NewsItem[]>([]);
  const [center, setCenter] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/news`
        );
        const data = await res.json();

        // Adjust if API wraps response inside data field
        const newsData = Array.isArray(data) ? data : data.data;

        const latestThree = newsData.slice(-3);
        setUpdates(latestThree);
        setCenter(1); // middle card default
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const getIndex = (offset: number) =>
    (center + offset + updates.length) % updates.length;

  const animate = () => {
    if (updates.length === 0) return;

    const left = getIndex(-1);
    const mid = center;
    const right = getIndex(1);

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

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
  }, [center, updates]);

  if (loading) {
    return (
      <section className="py-20 text-center">
        <p>Loading latest updates...</p>
      </section>
    );
  }

  return (
    <section className="light py-20 overflow-hidden">
      <ContainerLayout className="md:min-h-screen flex flex-col items-center gap-12">
        <h1 className="text-4xl md:text-6xl text-center">
          What&apos;s Happening Now
        </h1>

        {/* Carousel */}
        <div className="relative w-full h-[60dvh] md:h-[75dvh] flex items-center justify-center">
          {updates.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) cardsRef.current[idx] = el;
              }}
              className="absolute w-[320px] md:w-[360px]"
            >
              <UpdateCard
                title={item.title}
                img={item.coverImage}
                desc={item.summary}
                slug={`news/${item.slug}`}
                isActive={idx === center}
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        {updates.length > 1 && (
          <div className="flex gap-6 text-primary">
            <button
              onClick={() =>
                setCenter((c) => (c - 1 + updates.length) % updates.length)
              }
              className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black transition"
            >
              <ArrowLeft size={26} />
            </button>

            <button
              onClick={() => setCenter((c) => (c + 1) % updates.length)}
              className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black transition"
            >
              <ArrowRight size={26} />
            </button>
          </div>
        )}
      </ContainerLayout>
    </section>
  );
};

export default LatestUpdates;
