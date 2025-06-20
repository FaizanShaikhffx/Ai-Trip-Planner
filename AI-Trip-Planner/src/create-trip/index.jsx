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

  const logErrorToFirestore = async (message, details = {}, level = "error") => {
    try {
      const logDocId = new Date().getTime().toString();
      await setDoc(doc(db, "clientLogs", logDocId), {
        timestamp: new Date(),
        message: message,
        details: details,
        level: level,
      });
    } catch (logError) {
      console.error("Failed to log error to Firestore:", logError);
    }
  };

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

    await logErrorToFirestore("Attempting to save trip", {
      userObject: user,
      userEmail: user?.email,
      formData: formData
    }, "info");

    if (!user || !user.email) {
      console.error("User or user email is missing. Cannot save trip without user authentication.");
      await logErrorToFirestore("User authentication missing during trip save attempt", { user: user });
      setLoading(false);
      return; 
    }
    
    let parsedTripData;
    try {
      parsedTripData = JSON.parse(TripData);
      await logErrorToFirestore("AI TripData parsed successfully", { parsedData: parsedTripData }, "info");
    } catch (parseError) {
      console.error("Error parsing AI TripData:", parseError);
      await logErrorToFirestore("Error parsing AI TripData", { parseError: parseError.message, TripData: TripData });
      setLoading(false);
      return;
    }

    const docId = new Date().getTime().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: parsedTripData,
      userEmail: user.email,
      id: docId,
    });
    navigate('/view-trip/'+docId)
    setLoading(false); 
  } catch (error) {
    console.error("Error saving trip:", error);
    await logErrorToFirestore("Failed to save trip to Firestore", { error: error.message, code: error.code, stack: error.stack });
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
                formData?.traveler == item.id &&
                "shadow-lg border-gray-500 "
              }`}
              onClick={() => handleInputChange("traveler", item.id)}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg ">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 flex justify-end">
        <button className="bg-gray-800 text-white  px-4 py-2 rounded-md shadow hover:bg-gray-900 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading} onClick={onGenerateTrip}>
          {loading ? 
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
           : 
            "Generate Trip"
          }
        </button>
      </div>
      <Dialog open={openDailog} onOpenChange={setOpenDialog}>
        <DialogContent className='bg-white'>
          <DialogHeader>
            <DialogDescription>
                          <div className='flex items-center'>
                  <img src="/trip-logo.jpg" className='h-11' alt="" />
                  <h2 className='font-bold text-[#f56551] text-[40px] pl-3 '>Trav<span className='text-[#654a8c]'>AI</span>ler</h2>
                  </div>
              <h2 className="font-bold text-lg mt-7 ">Sign In With Google</h2>
              <p>Sign In to the App with Google Authentication securely</p>
              <button
                              disabled={loading}
                              onClick={login}
                              className="w-full mt-5 flex bg-gray-200 cursor-pointer rounded-xl shadow-sm p-2 items-center justify-center gap-3 "
                            >
                              <FcGoogle className="h-7 w-7 " />
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
