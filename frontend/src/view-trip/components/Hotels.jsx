import React from "react";
import HotelCardItem from "./HotelCardItem";

const Hotels = ({ trip }) => {

  const hotelData = trip?.tripData?.hotels ? undefined || null : trip?.tripData?.hotelOptions; 

  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Hotel Recommendation</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 xl:grid-cols-4">
        {hotelData?.map((hotel, index) => (
          <HotelCardItem hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default Hotels;
