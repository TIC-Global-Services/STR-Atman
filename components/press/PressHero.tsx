"use client";

import GradientBlinds from "../reuseable/GradiantBlinds";

const PressHero = () => {
  return (
    <section className="relative w-full h-[80dvh] bg-black flex items-center">
      <div className=" absolute inset-0">
        <GradientBlinds
          gradientColors={["#9effe7", "#74ff29"]}
          angle={30}
          noise={0.3}
          blindCount={16}
          blindMinWidth={20}
          mouseDampening={0.15}
          mirrorGradient={false}
          spotlightRadius={0.5}
          spotlightSoftness={1}
          spotlightOpacity={1}
          distortAmount={0}
          shineDirection="left"
        />
      </div>
      <div className=" px-6 md:px-14">
        <div className="max-w-4xl">
          {/* Main Title */}
          <h1
            className="text-white mb-8"
            style={{
              fontFamily: "Halfre, sans-serif",
              fontSize: "clamp(40px, 8vw, 80px)",
              lineHeight: "0.9",
              letterSpacing: "0%",
            }}
          >
            Press Desk
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 max-w-3xl text-3xl md:text-4xl">
            Official News, Announcements, And Media Coverage From Silambarasan
            TR
          </p>
        </div>
      </div>
    </section>
  );
};

export default PressHero;
