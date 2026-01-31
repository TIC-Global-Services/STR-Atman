"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlurText from "../reuseable/BlurText";
import PrimaryButton from "../reuseable/PrimaryButton";
import MembershipForm from "./MembershipForm";

const AdmirationSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(false);


  const Images = [
    { img: "/membership/slide1.jpg", title: "Slide 1" },
    { img: "/membership/slide2.jpg", title: "Slide 2" },
    { img: "/membership/slide3.jpg", title: "Slide 3" },
  ];

  return (
    <section className="light relative w-full bg-transparent py-20 light px-6 md:pl-10 overflow-hidden">
      <div className="w-full flex flex-col gap-14">
        <div
          ref={scrollContainerRef}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* Text Content */}
          <div className="max-w-lg space-y-6 flex flex-col justify-center">
            <BlurText
              text="Built on shared admiration"
              delay={60}
              animateBy="words"
              direction="top"
              className="text-black font-medium text-4xl"
            />
            <BlurText
              text="The STR Community Is Built On Genuine Admiration And Mutual Respect. It's A Verified Space Where Fans Come Together To Stay Connected."
              delay={5}
              animateBy="words"
              direction="top"
              className="text-black/80 text-[20px] leading-tight"
            />
          </div>

          {/* Image Carousel */}
          <div className="flex gap-4 md:gap-12 w-screen overflow-x-auto no-scrollbar scroll-smooth md:px-10">
            {Images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="w-[65%] md:w-[45%] aspect-3/4 h-[40dvh] md:h-[60dvh] shrink-0"
              >
                <Image
                  src={img.img}
                  alt={img.title}
                  width={500}
                  height={500}
                  className="object-cover object-top w-full h-full rounded-2xl shadow-lg"
                  priority
                />
              </motion.div>
            ))}
          </div>
        </div>

        <PrimaryButton
          onClick={() => setShowPopup(true)}
          title="Join the Club"
          className="mx-auto"
        />
      </div>

      {/* Membership Popup Modal */}
      <MembershipForm
        showPopup={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </section>
  );
};

export default AdmirationSection;
