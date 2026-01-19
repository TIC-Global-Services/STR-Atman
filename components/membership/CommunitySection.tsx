"use client";
import Image from 'next/image';

const CommunitySection = () => {
  return (
    <section className="relative w-full bg-transparent flex items-center justify-center py-20">
      <div className="relative" style={{ width: '1340px', height: '600px' }}>
        {/* Background Image */}
        <Image
          src="/membership/community.jpg"
          alt="Community member"
          fill
          className="object-cover"
          style={{ objectPosition: 'center 10%' }}
          priority
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Text Content Overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="px-12 lg:px-16 space-y-8 max-w-2xl">
            <h2 
              className="text-white"
              style={{ 
                fontFamily: 'Halfre, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(40px, 6vw, 40px)',
                lineHeight: '1.1',
                letterSpacing: '0%'
              }}
            >
              A space for<br />
              the community
            </h2>
            
            <p className="text-white/90 text-24px lg:text-xl leading-tight">
              The STR Membership platform is built to bring the fan community closer, creating a verified, respectful space where fans can participate, share moments, and be part of official updates. This is not just a fan club; it's a curated community driven by authenticity and mutual respect.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;