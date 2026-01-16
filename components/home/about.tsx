import React from 'react'

const About = () => {
  return (
    <div>
        <h1 className='text-5xl font-normal text-center mt-32'>About Section</h1>
        <p className='mt-10 px-10 text-center'>
        Now that we set up the basic project structure, we need a way to run the project locally and access it through a web browser
        </p>
        <p className='mt-10 px-10 text-center'>
         Installation and local development can be accomplished with npm and a build tool, or by importing three.js from a CDN
        </p>
    </div>
  )
}

export default About