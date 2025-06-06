import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';

const UserTripCardItem = ({trip}) => {

   const [photoUrl, setPhotoUrl] = useState();
      
        useEffect(() => {
          trip&&GetPlacePhoto();
        }, [trip]);
      
        const GetPlacePhoto = async () => {
          const data = {
            textQuery: await trip?.userSelection?.location?.label
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
    <Link to={'/view-trip/'+trip?.id}>
    <div className='hover:scale-105 transition-all  '>
      <img src={photoUrl? photoUrl : "/placeholder.jpg" } className='object-cover rounded-xl h-[225px] ' alt="" />
      <div>
        <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label}</h2>
        <h2 className='text-sm'>{trip?.userSelection?.noOfDays} Days Trip with {trip?.userSelection?.budget} Budget</h2>
      </div>
    </div>
    </Link>
  )
}

export default UserTripCardItem
