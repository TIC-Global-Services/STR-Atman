"use client";
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'

const Navbar = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const toggleAudio = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          audioRef.current.load()
          await audioRef.current.play()
          setIsPlaying(true)
        }
      } catch (error) {
        console.error('Audio playback failed:', error)
        setIsPlaying(false)
      }
    }
  }

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-transparent'>
      <div className='flex justify-between items-center px-6 lg:px-12 py-3'>
        {/* STR Logo */}
        <div className='flex-shrink-0'>
          <Link href="/" className='cursor-pointer block'>
            <Image
              src="/strlogo.png"
              alt="STR Logo"
              width={120}
              height={50}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Right Side - Audio, Store, Menu */}
        <div className='flex items-center gap-4 lg:gap-6'>
          {/* Audio Control */}
          <button 
            onClick={toggleAudio}
            className='flex items-center gap-2 text-white text-xs lg:text-sm hover:text-green-400 transition-colors duration-200'
          >
            <svg 
              width="24" 
              height="20" 
              viewBox="0 0 24 20" 
              fill="none" 
              className={`${isPlaying ? 'text-green-400' : 'text-white'} transition-colors duration-200`}
            >
              <path 
                d="M2 10C2 10 4 6 6 10C8 14 10 6 12 10C14 14 16 6 18 10C20 14 22 10 22 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <div className='flex flex-col items-start leading-tight'>
              <span className='font-medium text-[10px] lg:text-xs'>AUDIO</span>
              <span className={`font-bold text-xs lg:text-sm ${isPlaying ? 'text-green-400' : 'text-white'}`}>
                {isPlaying ? 'ON' : 'OFF'}
              </span>
            </div>
          </button>

          {/* Store Button */}
          <button className='bg-green-500 hover:bg-green-600 text-black font-bold text-xs lg:text-sm py-2 px-4 lg:px-6 rounded-md transition-colors duration-200 flex items-center gap-2'>
            <Image
              src="/shopicon.png"
              alt="Store"
              width={18}
              height={18}
              className="object-contain"
            />
            STORE
          </button>
          
          {/* Menu Icon */}
          <button className='text-white hover:opacity-80 transition-opacity duration-200 p-1'>
            <Image
              src="/menuicon.png"
              alt="Menu"
              width={28}
              height={28}
              className="object-contain"
            />
          </button>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          preload="metadata"
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            console.error('Audio failed to load:', e)
            setIsPlaying(false)
          }}
        >
          <source src="/loosu-penne.mp3" type="audio/mpeg" />
          <source src="/loosu-penne-song.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </nav>
  )
}

export default Navbar