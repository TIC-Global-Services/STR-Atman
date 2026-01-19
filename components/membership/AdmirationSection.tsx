"use client";
import Image from 'next/image';
import { useRef, useState } from 'react';

const AdmirationSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleJoinClub = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted');
    setShowPopup(false);
  };

  return (
    <section className="relative w-full bg-transparent pb-20 light">
      <div className="w-full">
        <div 
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto scrollbar-none pb-4 pl-6 lg:pl-12 pr-5"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Text Content - First item in carousel */}
          <div className="shrink-0 w-96 lg:w-[480px] space-y-6 flex flex-col justify-center">
            <h2 
              className="text-black"
              style={{ 
                fontFamily: 'Halfre, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(36px, 5vw, 30px)',
                lineHeight: '1.1',
                letterSpacing: '0%'
              }}
            >
              Built on shared admiration
            </h2>
            
            <p className="text-black/80 text-[20px] leading-tight">
              The STR Community Is Built On Genuine Admiration And Mutual Respect. It&apos;s A Verified Space Where Fans Come Together To Stay Connected, Celebrate Meaningful Moments, And Engage With STR&apos;s Journey Through Official Updates And Shared Experiences.
            </p>
          </div>

          {/* Image 1 */}
          <div className="shrink-0 relative overflow-hidden" style={{ width: '368px', height: '508px', borderRadius: '12px' }}>
            <Image
              src="/membership/slide1.jpg"
              alt="STR Community Image 1"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Image 2 */}
          <div className="shrink-0 relative overflow-hidden" style={{ width: '368px', height: '508px', borderRadius: '12px' }}>
            <Image
              src="/membership/slide2.jpg"
              alt="STR Community Image 2"
              fill
              className="object-cover"
              style={{ objectPosition: 'center 0%' }}
              priority
            />
          </div>

          {/* Image 3 - Partially visible, reveals on scroll */}
          <div className="shrink-0 relative overflow-hidden" style={{ width: '368px', height: '508px', borderRadius: '12px' }}>
            <Image
              src="/membership/slide3.jpg"
              alt="STR Community Image 3"
              fill
              className="object-cover"
            />
          </div>

          {/* Join the Club Button - Final item in carousel */}
          <div className="shrink-0 flex items-end justify-left pr-5" style={{ width: 'auto', height: '508px' }}>
            <button 
              onClick={handleJoinClub}
              className="bg-[#1DB954] text-black hover:bg-[#1DB954]-800 transition-colors duration-300 whitespace-nowrap"
              style={{ 
                height: '42px',
                borderRadius: '4px',
                paddingTop: '10px',
                paddingRight: '30px',
                paddingBottom: '10px',
                paddingLeft: '30px',
                fontFamily: 'Halfre, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                letterSpacing: '0%'
              }}
            >
              Join the Club
            </button>
          </div>
        </div>
      </div>
      
      {/* Membership Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 relative">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            {/* Modal Content */}
            <div className="text-center mb-8">
              <h2 
                className="text-black mb-4"
                style={{ 
                  fontFamily: 'Halfre, sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  lineHeight: '1.1',
                  letterSpacing: '0%'
                }}
              >
                Become a member
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
                A Verified STR Community Built On Admiration And Respect, Where Fans Connect And Stay Updated Through Official Moments.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="City / State"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg transition-colors duration-300"
                  style={{ 
                    fontFamily: 'Halfre, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px'
                  }}
                >
                  Submit Customer Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default AdmirationSection;