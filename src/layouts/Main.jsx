import React from 'react'
import NavBar from "../components/Navbar"
import Footer from "../components/Footer"
import { Outlet } from 'react-router-dom'

export default function Main(){
  return (
    <div className="h-screen w-screen bg-[white]">
    <NavBar/>
    <Outlet/> 
    <Footer/>
    </div> 
 )
}