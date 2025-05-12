import React from 'react'
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className='flex flex-col lg:flex-row justify-center items-center pt-6 lg:pt-10 px-4 lg:px-9 gap-8 lg:gap-0'>
      <div className='w-full lg:w-2/3'>
        <img src="hero.jpg" alt="Hero" className='w-full h-auto object-cover rounded-lg ' />
      </div>
      <div className='flex w-full lg:w-1/2 items-center lg:mx-28 flex-col gap-6 lg:gap-9'>
        <h1 className='font-extrabold text-[#2d1b4f] text-3xl md:text-4xl lg:text-[48px] text-center leading-tight'>
          <span className='text-[#f56551] block lg:inline'>Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips.
        </h1>
        <p className='text-lg lg:text-xl text-gray-500 text-center max-w-2xl'>
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budjet.
        </p>
        <Link to="/create-trip" className='w-full sm:w-auto'>
          <button className='w-full sm:w-auto bg-gray-800 text-white px-6 py-3 rounded-md shadow hover:bg-gray-900 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-base lg:text-lg'>
            Get Started, It's Free
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Hero