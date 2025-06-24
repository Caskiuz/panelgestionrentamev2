import React, { useState } from 'react';
import Navbar from '../components/navbar';
import background from '../images/REN-ENE-2.png'
import background2 from '../images/background_index.jpg'
export default function Homepage() {

  return (
    <>
    <div className='w-full flex flex-col'>
    <Navbar/>
    <div className='w-full h-[90vh]'>
      <img className=' lg:flex hidden lg:object-fill w-full h-[90vh]' src={background} alt="" />
      <img className=' lg:hidden flex object-cover w-full h-[90vh]' src={background2} alt="" />
    </div>
    </div>
    </>
  );
}
