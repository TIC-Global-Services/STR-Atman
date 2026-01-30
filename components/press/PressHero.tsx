"use client";

const PressHero = () => {
  return (
    <section className="relative w-full h-[80dvh] bg-black flex items-center">
      <div className=" px-14">
        <div className="max-w-4xl">
          {/* Main Title */}
          <h1 
            className="text-white mb-8"
            style={{ 
              fontFamily: 'Halfre, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(60px, 8vw, 80px)',
              lineHeight: '0.9',
              letterSpacing: '0%'
            }}
          >
            Press Desk
          </h1>
          
          {/* Subtitle */}
          <p 
            className="text-white/90 max-w-4xl"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 40px)',
              lineHeight: '1.1',
              fontWeight: 400
            }}
          >
            Official News, Announcements, And Media Coverage <br />From Silambarasan TR
          </p>
        </div>
      </div>
    </section>
  );
};

export default PressHero;