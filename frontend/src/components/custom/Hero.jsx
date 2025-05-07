import React from 'react'
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className='flex items-center mx-56 flex-col gap-9'>
      <h1 className='font-extrabold text-[60px] text-center mt-16'>
        <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips
      </h1>
      <p className='text-xl text-gray-500 text-center'>Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budjet.</p>
      <Link to="/create-trip">
      <button>Get Started, It's Free</button>
      </Link>
    </div>
  )
}

export default Hero
