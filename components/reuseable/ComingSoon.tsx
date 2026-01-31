"use client";

import { useState } from "react";
import { IoIosArrowForward as RightArrow } from "react-icons/io";
import FuzzyText from "./FuzzyText";

const ComingSoon = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Early access email:", email);
    setEmail("");
  };

  return (
    <section className=" light relative min-h-screen w-full flex items-center justify-center overflow-hidden  px-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, #00000008 1px, transparent 1px),
            radial-gradient(circle at 80% 30%, #00000008 1px, transparent 1px),
            radial-gradient(circle at 40% 70%, #00000008 1px, transparent 1px)
          `,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-xl w-full flex flex-col items-center justify-center text-center">

        <FuzzyText className=" py-6" color="black" baseIntensity={0.1} hoverIntensity={0.2} enableHover>
          Coming Soon
        </FuzzyText>

        <p className="text-black/70 text-[clamp(1rem,2.5vw,1.25rem)] mb-10">
          This is currently being worked on and will
          <br className="hidden sm:block" />
          be available soon.
        </p>

        <p className="text-black font-medium mb-4">
          Want first access when its ready?
        </p>

        {/* Email input */}
        <form onSubmit={handleSubmit} className="mx-auto max-w-md w-full">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full h-12 rounded-full border border-black/80
                pl-5 pr-14 text-sm
                placeholder:text-black/40
                focus:outline-none focus:ring-2 focus:ring-black/10
              "
            />

            <button
              type="submit"
              aria-label="Submit email"
              className="
                absolute cursor-pointer right-1 top-1/2 -translate-y-1/2
                h-10 w-10 rounded-full
                flex items-center justify-center
                border border-black
                hover:bg-black hover:text-white
                transition-all duration-300
              "
            >
              <RightArrow />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ComingSoon;
