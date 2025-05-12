import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";

const InfoSection = ({ trip }) => {
  
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
    <div>
      <img
        src={photoUrl? photoUrl : "/placeholder.jpg" }
        alt="image"
        className="h-[300px] w-full obkect-cover rounded-xl "
      />

      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2 ">
          <h2 className="font-bold text-2xl ">
            {trip?.userSelection?.location?.label}
          </h2>
          <div className="flex gap-5">
            <h2 className="p-1 px-3 bg-gray-200  rounded-full text-gray-500 text-xs md:text-md">
              📅 {trip?.userSelection?.noOfDays} Day
            </h2>
            <h2 className="p-1 px-3 bg-gray-200  rounded-full text-gray-500 text-xs md:text-md">
              💰 {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200  rounded-full text-gray-500 text-xs md:text-md">
              🥂 No. Of Traveler: {trip?.userSelection?.traveler}
            </h2>
          </div>
        </div>
        <button>
          <IoIosSend />{" "}
        </button>
      </div>
    </div>
  );
};

export default InfoSection;
