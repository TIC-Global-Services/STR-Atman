"use client";

const PressHero = () => {
  return (
    <section className="relative w-full h-[80dvh] bg-black flex items-center">
      <div className=" px-6 md:px-14">
        <div className="max-w-4xl">
          {/* Main Title */}
          <h1 
            className="text-white mb-8"
            style={{ 
              fontFamily: 'Halfre, sans-serif',
              fontSize: 'clamp(40px, 8vw, 80px)',
              lineHeight: '0.9',
              letterSpacing: '0%'
            }}
          >
            Press Desk
          </h1>
          
          {/* Subtitle */}
          <p 
            className="text-white/90 max-w-3xl text-3xl md:text-4xl"
          >
            Official News, Announcements, And Media Coverage From Silambarasan TR
          </p>
        </div>
      </div>
    </section>
  );
};

export default PressHero;