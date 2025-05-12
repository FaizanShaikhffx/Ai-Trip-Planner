import React, {useEffect, useState} from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


const Header = () => {

  const user = JSON.parse(localStorage.getItem('user'))
  const [openDailog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(()=>{
    console.log(user);
  }, [])

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => GetUserProfile(tokenResponse),
    onError: (error) => console.log(error),
  });

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
        console.log(resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        window.location.reload(); 
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };
  return (
    <div  className='shadow-sm  flex justify-between items-center px-4 p-2'>
      <div className='flex items-center'>
      <img src="/trip-logo.jpg" className='h-11' alt="" />
      <h2 className='font-bold text-[#f56551] text-[40px] pl-3 '>Trav<span className='text-[#654a8c]'>AI</span>ler</h2>
      </div>
      <div>
        {
          user? <div className='flex  items-center gap-3 '>
            <Link to="/create-trip">
            <button className='bg-gray-800 text-white font-bold px-4 py-2 rounded-md shadow hover:bg-gray-900 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500'>+ Create Trip</button>  
            </Link>
            <Link to="/my-trips">
            <button className='bg-gray-800 text-white px-4 font-bold  py-2 rounded-md shadow hover:bg-gray-900 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500'>My Trips</button>  
            </Link>
            <Popover>
              <PopoverTrigger >
                <img className='h-10 rounded-full cursor-pointer' src={user?.picture} alt="" />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className='cursor-pointer'
                onClick={()=>{
                  googleLogout(); 
                  localStorage.clear(); 
                  navigate("/")
                }}
                >Logout</h2>
              </PopoverContent>
            </Popover>

          </div> :
      <button className='bg-gray-800 text-white px-4 py-2 rounded-md shadow hover:bg-gray-900 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500' onClick={()=> setOpenDialog(true)}>Sign In</button>
    }
      </div>
       <Dialog  open={openDailog} onOpenChange={setOpenDialog}>
        <DialogContent className='bg-white'>
          <DialogHeader>
            <DialogDescription>
              <div className='flex items-center'>
      <img src="/trip-logo.jpg" className='h-11' alt="" />
      <h2 className='font-bold text-[#f56551] text-[40px] pl-3 '>Trav<span className='text-[#654a8c]'>AI</span>ler</h2>
      </div>
              <h2 className="font-bold  text-lg mt-7 ">Sign In With Google</h2>
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
  )
}

export default Header
