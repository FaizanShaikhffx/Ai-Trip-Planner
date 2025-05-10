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
    <div  className='shadow-sm  flex justify-between items-center px-5 p-3'>
      <img src="/logo.svg" alt="" />
      <div>
        {
          user? <div className='flex  items-center gap-3 '>
            <Link to="/my-trips">
            <button className='rounded-full'>My Trips</button>  
            </Link>
            <Popover>
              <PopoverTrigger>
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
      <button onClick={()=> setOpenDialog(true)}>Sign In</button>
    }
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
  )
}

export default Header
