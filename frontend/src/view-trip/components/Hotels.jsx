import React from 'react'

const Hotels = ({trip}) => {
  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-5 xl:grid-cols-4'>
        {trip?.tripData?.hotels?.map((hotel, index)=>(
          
          <div key={index} className='hover:scale-105 cursor-pointer transition-all '>
            <img src="/placeholder.jpg" className='rounded-lg ' alt="image" />
            <div className='my-3 flex flex-col'>
              <h2 className='font-medium'>{hotel?.name}</h2>
              <h2 className='text-sx text-gray-500'> 📍{hotel?.address}</h2> 
              <h2>⭐ {hotel?.rating} stars</h2>
            </div>
          </div>
          
        ))}
      </div>
    </div>
  )
}

export default Hotels
