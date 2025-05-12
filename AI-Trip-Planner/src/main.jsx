import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CreateTrip from './create-trip/index.jsx'
import Header from './components/custom/Header.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ViewTrip from './view-trip/[tripId]/index.jsx'
import MyTrips from "./my-trips/index.jsx"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header/>
    <Routes>
      <Route path="/create-trip"  element={<CreateTrip/>} />
      <Route path="/"  element={<App/>} />
      <Route path="/view-trip/:tripId"  element={<ViewTrip/>} />
      <Route path="/my-trips"  element={<MyTrips/>} />
    </Routes>
    </GoogleOAuthProvider>;
  </BrowserRouter>,
)
