"use client";
import Image from 'next/image';

const MusicHero = () => {
  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {/* Title - Behind the image */}
        <div className="absolute inset-0 flex items-center justify-center -translate-y-30">
          <h1 
            className="text-white whitespace-nowrap" 
            style={{ 
              fontFamily: 'Halfre, sans-serif',
              fontWeight: 400,
              fontSize: '120px',
              lineHeight: '128px',
              letterSpacing: '0%',
              verticalAlign: 'middle'
            }}
          >
            Musical Journey
          </h1>
        </div>

        {/* Person Image - In front of title */}
        <div className="relative z-20 w-full h-full flex items-end justify-center pb-0">
          <div className="relative w-[600px] h-[700px] lg:w-[700px] lg:h-[800px] xl:w-[800px] xl:h-[900px] translate-y-25">
            <Image
              src="/musicalsimbu.png"
              alt="Musical Journey"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicHero;
