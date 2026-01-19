"use client";

const PressSection = () => {
  return (
    <section className="relative w-full bg-transparent py-20 light">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start relative">
          {/* Left Column - Title and Description (Larger) */}
          <div className="space-y-6 lg:col-span-3">
            <h2 
              className="text-black"
              style={{ 
                fontFamily: 'Halfre, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(36px, 5vw, 40px)',
                lineHeight: '1.1',
                letterSpacing: '0%'
              }}
            >
              Press Synopsis
            </h2>
            
            <p className="text-[#646464] text-[28px] leading-tight max-w-4xl pr-[40px]">
              STR&apos;s media journey across cinema, interviews, headlines and iconic public moments.
            </p>
          </div>

          {/* Vertical line positioned with 60px gap from left and 40px gap from right */}
          <div className="absolute w-px h-full bg-gray-500 hidden lg:block" style={{ left: 'calc(60% - 10px)', top: 0 }}></div>

          {/* Right Column - Additional Description (Smaller) */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="text-left max-w-md pt-10 ">
              <p className="text-[black] text-[20px] leading-tight">
                From press meets and exclusive interviews to headline-making coverage... STR&apos;s most impactful media moments curated into a single archive
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PressSection;