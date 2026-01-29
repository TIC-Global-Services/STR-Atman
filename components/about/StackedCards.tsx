"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Card {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
}

const cards: Card[] = [
  {
    id: 1,
    title: "Performance-Driven Project",
    description:
      "A Performance-Driven Project Rooted In Strong Writing And Emotional Depth. Currently In Progress.",
    date: "2025 Dec",
    image: "/update1.jpg",
  },
  {
    id: 2,
    title: "Creative Vision",
    description:
      "Exploring new dimensions of storytelling through innovative cinematography and compelling narratives.",
    date: "2024 Nov",
    image: "/update2.jpg",
  },
  {
    id: 3,
    title: "Artistic Excellence",
    description:
      "Pushing boundaries in visual storytelling with cutting-edge techniques and artistic vision.",
    date: "2024 Oct",
    image: "/update3.jpg",
  },
  {
    id: 4,
    title: "Cultural Impact",
    description:
      "Creating content that resonates with audiences and leaves a lasting cultural impression.",
    date: "2024 Sep",
    image: "/update4.jpg",
  },
];

const StackedCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % cards.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const visibleCards = Array.from({ length: 4 }).map((_, i) => {
    const index = (currentIndex + i) % cards.length;
    return { ...cards[index], stackPosition: i };
  });

  const bringToFront = (id: number) => {
    const newIndex = cards.findIndex((c) => c.id === id);
    setCurrentIndex(newIndex);
  };

  const activeCard = visibleCards[0];

  return (
    <section className=" light relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-[8vh]">
      <h2 className="text-center mb-[6vh] text-gray-900 font-normal
        text-[clamp(2rem,6vw,4rem)]">
        Where The Journey Leads
      </h2>

      <div className="w-full max-w-[90vw] flex flex-col items-center md:-ml-[35%]">
        {/* Cards */}
        <div
          className="relative w-full max-w-[28rem]"
          style={{ aspectRatio: "433 / 464" }}
        >
          <AnimatePresence>
            {visibleCards.map((card) => {
              const pos = card.stackPosition;
              const isActive = pos === 0;

              return (
                <motion.div
                  key={card.id}
                  drag={pos !== 0 ? "x" : false}
                  dragConstraints={{ left: -120, right: 120 }}
                  dragElastic={0.25}
                  onDragEnd={() => bringToFront(card.id)}
                  initial={{
                    scale: 1 - pos * 0.08,
                    x: `${pos * 42}%`,
                    opacity: 0,
                    rotateY: pos * 8,
                  }}
                  animate={{
                    scale: isActive ? 1 : 1 - pos * 0.08,
                    x: isActive ? "0%" : `${pos * 42}%`,
                    y: isActive ? 0 : pos * 6,
                    opacity: 1,
                    rotateY: isActive ? 0 : pos * 8,
                  }}
                  exit={{
                    x: "-40%",
                    opacity: 0,
                    rotateY: -30,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 20,
                  }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  style={{
                    zIndex: 100 - pos,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Card */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      priority={isActive}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition flex items-end p-4">
                      <h3 className="text-white text-lg opacity-0 hover:opacity-100 transition">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Active Card Info */}
        <div className="mt-6 w-full max-w-[28rem] text-left">
          <motion.div
            key={activeCard.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-gray-500 leading-relaxed mb-2">
              {activeCard.description}
            </p>
            <p className="text-gray-900 font-semibold text-lg">
              {activeCard.date}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StackedCards;
