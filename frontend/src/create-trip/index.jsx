import React, { useEffect } from "react";
import { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { SelectBudgetOptions, SelectTravelesList } from "../constants/options";
import { AI_PROMPT } from "../constants/options";
import { chatSession } from "../service/AIModal";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../service/firebaseConfig.jsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


const CreateTrip = () => {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState();
  const [openDailog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => GetUserProfile(tokenResponse),
    onError: (error) => console.log(error),
  });

  const onGenerateTrip = async () => {
  try {
    setLoading(true); 

    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      setLoading(false); 
      return;
    }

    if (!formData?.location || !formData?.budget || !formData.traveler) {
      alert("Please fill all details");
      setLoading(false); 
      return;
    }

    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", formData?.location?.label)
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result?.response?.text());

    await SaveAITrip(result?.response?.text());
  } catch (error) {
    console.error("Error generating trip:", error);
  } finally {
    setLoading(false);
  }
};

  const SaveAITrip = async (TripData) => {
  try { 
    setLoading(true); 
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = new Date().getTime().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId,
    });
    navigate('/view-trip/'+docId)
    setLoading(false); 
  } catch (error) {
    console.error("Error saving trip:", error);
  } 
};

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp.data);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        onGenerateTrip();
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };
  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72  px-5 mt-10">
      <h2 className="font-bold text-3xl ">
        Tell us your travel preferences 🏕️🌴
      </h2>
      <p className="mt-3 text-gray-500 text-xl ">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preference.
      </p>

      <div className="mt-20 flex gap-10 flex-col ">
        <div>
          <h2 className="text-xl my-3 font-medium ">
            What is your destination of choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
            }}
          />
        </div>

        <div>
          <h2>How many days are you planning your trip</h2>
          <input
            className="border h- w-full p-1 border-[#cccccc] rounded-sm"
            type="number"
            placeholder={"Ex.3"}
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium ">What is your Budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border border-gray-300 cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.budget == item.title && "shadow-lg border-gray-500 "
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg ">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium ">
          Who do you plan on traveling with on your next adventure?
        </h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              className={`p-4 border border-gray-300 cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.traveler == item.people &&
                "shadow-lg border-gray-500 "
              }`}
              onClick={() => handleInputChange("traveler", item.people)}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg ">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 flex justify-end">
        <button disabled={loading} onClick={onGenerateTrip}>
          {loading ? 
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
           : 
            "Generate Trip"
          }
        </button>
      </div>
      <Dialog open={openDailog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="" />
              <h2 className="font-bold text-lg mt-7 ">Sign In With Google</h2>
              <p>Sign In to the App with Google Authentication securely</p>
              <button
                disabled={loading}
                onClick={login}
                className="w-full mt-5 flex items-center justify-center gap-3 "
              >
                <FcGoogle className="h-7 w-7" />
                Sign In With Google
              </button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTrip;
