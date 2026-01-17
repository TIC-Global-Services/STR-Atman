"use client";
import Image from 'next/image';

interface MusicCard {
  id: number;
  title: string;
  image: string;
  hasVinyl?: boolean;
}

const musicData: MusicCard[] = [
  { id: 1, title: 'Vallavan', image: '/record1.png', hasVinyl: true },
  { id: 2, title: 'Vaanam', image: '/record2.png', hasVinyl: true },
  { id: 3, title: 'Silambarasan', image: '/record3.jpg', hasVinyl: true },
  { id: 4, title: 'Poda Podi', image: '/record4.png', hasVinyl: true },
  { id: 5, title: 'Love Anthem', image: '/record5.jpg', hasVinyl: true },
  { id: 6, title: 'Kaalai', image: '/record6.png', hasVinyl: true },
];

const MusicCards = () => {

  return (
    <section className="relative w-full py-20 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Where emotion finds a voice
          </h2>
          <p className="text-gray-600 text-base lg:text-lg max-w-4xl mx-auto leading-relaxed">
            Music has always been a personal space for Silambarasan TR — a way to express what words and 
            performances sometimes cannot. From lending his voice to meaningful songs to being deeply 
            involved in the musical spirit of his films, music has remained an essential part of the journey.
          </p>
        </div>

        {/* Music Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {musicData.map((music) => (
            <div
              key={music.id}
              className="group cursor-pointer flex flex-col items-center"
            >
              <div className="relative mb-4">
                {/* Album Cover */}
                <div className="relative w-[267px] h-[267px] rounded-lg overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-105 z-10">
                  <Image
                    src={music.image}
                    alt={music.title}
                    fill
                    className="object-cover"
                  />
                  {/* Ambient lighting overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                </div>

                {/* Vinyl Record Effect (only for first card) */}
                {music.hasVinyl && (
                  <div className="absolute left-0 top-0 w-[267px] h-[267px] z-0 transition-transform duration-700 ease-out group-hover:translate-x-[133.5px]">
                    {/* Vinyl disc */}
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl">
                      {/* Grooves - multiple concentric circles */}
                      <div className="absolute inset-0 rounded-full">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute rounded-full border border-gray-700"
                            style={{
                              top: `${i * 5}%`,
                              left: `${i * 5}%`,
                              right: `${i * 5}%`,
                              bottom: `${i * 5}%`,
                              opacity: 0.3 - i * 0.01,
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Center label area with album image */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-gray-800 shadow-inner">
                        <Image
                          src={music.image}
                          alt={music.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Center hole */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black border-2 border-gray-600 shadow-lg" />
                      
                      {/* Enhanced shine effects */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-white/10 via-transparent to-transparent" />
                      <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-white/20 blur-2xl" />
                      <div className="absolute bottom-[15%] right-[15%] w-[25%] h-[25%] rounded-full bg-white/15 blur-xl" />
                      
                      {/* Ambient lighting on vinyl */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-60" />
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-black" style={{ fontSize: '24px' }}>
                {music.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Know More Button */}
        <div className="flex justify-center">
          <button className="group flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200">
            <span className="text-lg">Know More</span>
            <svg 
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MusicCards;
