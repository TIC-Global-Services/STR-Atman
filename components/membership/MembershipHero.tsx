"use client";
import Image from 'next/image';

const MembershipHero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/membership/memberherobg.jpg"
          alt="Membership Background"
          fill
          className="object-cover"
          style={{ objectPosition: 'center 30%' }}
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {/* Title */}
        <h1 
          className="text-white text-center"
          style={{ 
            fontFamily: 'Halfre, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(80px, 12vw, 120px)',
            lineHeight: '0.9',
            letterSpacing: '0%'
          }}
        >
          Become A Member
        </h1>
      </div>

      {/* Person Image - positioned to overlap with bg person */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[1200px] h-[1200px] lg:w-[1300px] lg:h-[1300px] xl:w-[1400px] xl:h-[1400px] translate-y-30">
          <Image
            src="/membership/membersimbuu.png"
            alt="STR Membership"
            fill
            className="object-contain object-center"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default MembershipHero;