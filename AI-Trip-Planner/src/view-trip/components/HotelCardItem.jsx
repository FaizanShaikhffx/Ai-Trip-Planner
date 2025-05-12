import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

const HotelCardItem = ({hotel}) => {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    hotel&&GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: await hotel?.name,
    };
    const result = await GetPlaceDetails(data).then((response) => {
      console.log(response.data.places[0].photos[3].name);

      const PhotoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        response.data.places[0].photos[3].name
      );

      setPhotoUrl(PhotoUrl);
    });
  };
  return (
    
       <Link to={'https://www.google.com/maps/search/?api=1&query=lumen+field'+hotel?.name+","+hotel?.address} target='_blank'>
          <div className='hover:scale-105 cursor-pointer transition-all '>
            <img src={photoUrl? photoUrl : "/placeholder.jpg" } className='rounded-xl h-[180px] w-full object-cover ' alt="image" />
            <div className='my-3 flex flex-col'>
              <h2 className='font-medium'>{hotel?.name}</h2>
              <h2 className='text-sx text-gray-500'> 📍{hotel?.address}</h2> 
              <h2>⭐ {hotel?.rating} stars</h2>
            </div>
          </div>
          </Link>
    
  )
}

export default HotelCardItem
