import React from 'react';
import PlaceCardItem from './PlaceCardItem';

const PlacesToVisit = ({ trip, dailyItinerary = [] }) => {
  const itinerary = trip?.tripData?.itinerary ? undefined || null : trip?.tripData?.dailyItinerary;

  return (
    <div>
      <h2 className="font-bold text-lg">Places to Visit</h2>

      {itinerary?.map((item, index) => (
        <div key={index} className="mt-5">
          <h2 className="font-bold text-lg">{item?.day}</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {item.plan.map((place, idx) => (
              <div key={idx} className="my-3">
                <h2 className="font-medium text-sm text-orange-600">{item.bestTime}</h2>
                <PlaceCardItem place={place} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlacesToVisit;
