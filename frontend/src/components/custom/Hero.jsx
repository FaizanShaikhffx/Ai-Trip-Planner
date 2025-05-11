import React from 'react'
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className='flex justify-center items-center pt-10 p-9 '>
      <div className='w-2/3 '>
        <img src="hero.jpg" alt="" />
      </div>
    <div className='flex w-1/2 items-center mx-28 flex-col gap-9'>
      <h1 className='font-extrabold text-[#2d1b4f] text-[48px] text-center '>
        <span className='text-[#f56551] '>Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips.
      </h1>
      <p className='text-xl text-gray-500 text-center'>Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budjet.</p>
      <Link to="/create-trip">
      <button className='bg-gray-800 text-white  px-4 py-2 rounded-md shadow hover:bg-gray-900 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500'>Get Started, It's Free</button>
      </Link>
    </div>
  </div>
  )
}

export default Hero
