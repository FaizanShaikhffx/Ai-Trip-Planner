import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openDailog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
  }, []);

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
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  return (
    <div className="shadow-sm flex flex-wrap items-center justify-between px-3 py-2 w-full">
      {/* Logo */}
      <div className="flex items-center shrink-0">
        <img src="/trip-logo.jpg" className="h-7 sm:h-8" alt="logo" />
        <h2 className="font-bold text-[#f56551] text-lg sm:text-xl pl-2">
          Trav<span className="text-[#654a8c]">AI</span>ler
        </h2>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 ml-auto">
        {user ? (
          <>
            <Link to="/create-trip">
              <button className="text-xs sm:text-sm px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 transition">
                + Trip
              </button>
            </Link>
            <Link to="/my-trips">
              <button className="text-xs sm:text-sm px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 transition">
                My Trips
              </button>
            </Link>
            <Popover>
              <PopoverTrigger>
                <img
                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full cursor-pointer flex-shrink-0 min-w-0"
                  src={user?.picture}
                  alt="user"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className="cursor-pointer text-sm"
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    navigate("/");
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <button
            onClick={() => setOpenDialog(true)}
            className="text-xs sm:text-sm px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={openDailog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogDescription>
              <div className="flex items-center">
                <img src="/trip-logo.jpg" className="h-8" alt="logo" />
                <h2 className="font-bold text-[#f56551] text-lg pl-2">
                  Trav<span className="text-[#654a8c]">AI</span>ler
                </h2>
              </div>
              <h2 className="font-bold text-base mt-5">Sign In With Google</h2>
              <p className="text-sm text-gray-600">
                Secure Google Authentication
              </p>
              <button
                disabled={loading}
                onClick={login}
                className="w-full mt-4 flex bg-gray-200 rounded-xl shadow-sm p-2 items-center justify-center gap-2 text-sm"
              >
                <FcGoogle className="h-5 w-5" />
                Sign In With Google
              </button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
