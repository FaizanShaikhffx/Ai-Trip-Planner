import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CreateTrip from './create-trip/index.jsx'
import Header from './components/custom/Header.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Header/>
    <Routes>
      <Route path="/create-trip"  element={<CreateTrip/>} />
      <Route path="/"  element={<App/>} />
    </Routes>
  </BrowserRouter>,
)
