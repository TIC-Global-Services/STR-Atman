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
    description: "A Performance-Driven Project Rooted In Strong Writing And Emotional Depth. Currently In Progress.",
    date: "2025 Dec",
    image: "/update1.jpg" 
  },
  { 
    id: 2, 
    title: "Creative Vision", 
    description: "Exploring new dimensions of storytelling through innovative cinematography and compelling narratives.",
    date: "2024 Nov",
    image: "/update2.jpg" 
  },
  { 
    id: 3, 
    title: "Artistic Excellence", 
    description: "Pushing boundaries in visual storytelling with cutting-edge techniques and artistic vision.",
    date: "2024 Oct",
    image: "/update3.jpg" 
  },
  { 
    id: 4, 
    title: "Cultural Impact", 
    description: "Creating content that resonates with audiences and leaves a lasting cultural impression.",
    date: "2024 Sep",
    image: "/update4.jpg" 
  }
];

const StackedCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getVisibleCards = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % cards.length;
      visible.push({ ...cards[index], stackPosition: i });
    }
    return visible;
  };

  const visibleCards = getVisibleCards();
  const activeCard = visibleCards[0];

  return (
    <section className="relative w-full min-h-screen bg-transparent flex flex-col items-center justify-center py-20 px-6">
      {/* Title */}
      <h2 className="text-[80px] lg:text-6xl font-normal text-gray-900 mb-12 text-center">
        Where The Journey Leads
      </h2>

      {/* Cards and Info Container */}
      <div className="flex flex-col items-center -ml-140">
        {/* Stacked Cards */}
        <div className="relative w-[433px] h-[464px]">
          <AnimatePresence mode="popLayout">
            {visibleCards.map((card) => {
              const stackPosition = card.stackPosition;
              const isActive = stackPosition === 0;
              
              // Calculate x offset based on visibility requirements
              // Card 1 (pos 0): 100% visible, x = 0
              // Card 2 (pos 1): 50% visible, x = 216.5 (50% of 433px)
              // Card 3 (pos 2): 50% visible, x = 216.5 + 216.5 (50% of 433px)
              // Card 4 (pos 3): 50% visible, x = 216.5 + 216.5 + 216.5
              const xOffsets = [0, 216.5, 433, 649.5];
              const xPosition = xOffsets[stackPosition] || 0;

              return (
                <motion.div
                  key={card.id}
                  initial={{
                    scale: 1 - stackPosition * 0.1,
                    x: xPosition,
                    y: 0,
                    opacity: 0,
                    rotateY: stackPosition * 8,
                  }}
                  animate={{
                    scale: 1 - stackPosition * 0.1,
                    x: xPosition,
                    y: 0,
                    opacity: 1,
                    rotateY: stackPosition * 8,
                  }}
                  exit={{
                    scale: 0.85,
                    x: -200,
                    opacity: 0,
                    rotateY: -30,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  className="absolute top-0 left-0 group"
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1500px",
                    zIndex: 100 - stackPosition,
                  }}
                >
                  {/* Card */}
                  <div className="relative w-[433px] h-[464px] rounded-2xl overflow-hidden shadow-2xl bg-transparent cursor-pointer">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="433px"
                      priority={isActive}
                    />
                    
                    {/* Hover Overlay with Text */}
                    <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end p-6">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                        <h3 className="text-[20px] font-regular mb-2">{card.title}</h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Active Card Info - Directly Below Cards */}
        <div className="mt-6 w-[433px] text-center">
          <motion.div
            key={activeCard.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[#7F7F7F] text-base text-left lg:text-lg mb-2 leading-relaxed">
              {activeCard.description}
            </p>
            <p className="text-gray-900 font-bold text-left text-[20px]">
              {activeCard.date}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StackedCards;