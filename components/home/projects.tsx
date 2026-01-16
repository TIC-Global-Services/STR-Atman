"use client";
import React from 'react'
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger) 

const Projects = () => {
    const projectsRef = useRef(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const element = scrollContainerRef.current;
        gsap.to(element, {  
            scrollTrigger: {
                trigger: projectsRef.current,
                start: "top center",
                end: "bottom top",
                scrub: true,
                toggleActions: "play none none reverse",
            },
            x: "-500",
            ease: "none",
        });
    },[]);

  return (
    <div >
        <h1 className='text-5xl font-normal text-center mt-32'>Projects Section</h1>
        <div className='py-10 px-10 overflow-hidden' ref={projectsRef}>
                <div className='flex gap-5 flex-nowrap pb-4 hide-scrollbar' ref={scrollContainerRef}>
                {/* Project 1 */}
                <div className='w-125 h-105 bg-gray-500 rounded-lg mt-10 p-4 flex-shrink-0'>

                    <h2 className='text-3xl font-semibold mt-10'>Project Title 1</h2>
                    <p className='mt-2'>Brief description of Project 1.</p>
                </div>
                <div className='w-125 h-105 bg-gray-500 rounded-lg mt-10 p-4 flex-shrink-0'>

                    <h2 className='text-3xl font-semibold mt-10'>Project Title 1</h2>
                    <p className='mt-2'>Brief description of Project 1.</p>
                </div>
                <div className='w-125 h-105 bg-gray-500 rounded-lg mt-10 p-4 flex-shrink-0'>

                    <h2 className='text-3xl font-semibold mt-10'>Project Title 1</h2>
                    <p className='mt-2'>Brief description of Project 1.</p>
                </div>
                <div className='w-125 h-105 bg-gray-500 rounded-lg mt-10 p-4 flex-shrink-0'>

                    <h2 className='text-3xl font-semibold mt-10'>Project Title 1</h2>
                    <p className='mt-2'>Brief description of Project 1.</p>
                </div>
                <div className='w-125 h-105 bg-gray-500 rounded-lg mt-10 p-4 flex-shrink-0'>

                    <h2 className='text-3xl font-semibold mt-10'>Project Title 1</h2>
                    <p className='mt-2'>Brief description of Project 1.</p>
                </div>
                <div className='w-125 h-105 bg-gray-500 rounded-lg mt-10 p-4 flex-shrink-0'>

                    <h2 className='text-3xl font-semibold mt-10'>Project Title 1</h2>
                    <p className='mt-2'>Brief description of Project 1.</p>
                </div>
                <div className='w-125 h-105 bg-gray-500 rounded-lg mt-10 p-4 flex-shrink-0'>

                    <h2 className='text-3xl font-semibold mt-10'>Project Title 1</h2>
                    <p className='mt-2'>Brief description of Project 1.</p>
                </div>
                <div className='w-125 h-105 bg-gray-500 rounded-lg mt-10 p-4 flex-shrink-0'>

                    <h2 className='text-3xl font-semibold mt-10'>Project Title 1</h2>
                    <p className='mt-2'>Brief description of Project 1.</p>
                </div>
                <div className='w-125 h-105 bg-gray-500 rounded-lg mt-10 p-4 flex-shrink-0'>

                    <h2 className='text-3xl font-semibold mt-10'>Project Title 1</h2>
                    <p className='mt-2'>Brief description of Project 1.</p>
                </div>
                <div className='w-125 h-105 bg-gray-500 rounded-lg mt-10 p-4 flex-shrink-0'>

                    <h2 className='text-3xl font-semibold mt-10'>Project Title 1</h2>
                    <p className='mt-2'>Brief description of Project 1.</p>
                </div>
                <div className='w-125 h-105 bg-gray-500 rounded-lg mt-10 p-4 flex-shrink-0'>

                    <h2 className='text-3xl font-semibold mt-10'>Project Title 1</h2>
                    <p className='mt-2'>Brief description of Project 1.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Projects