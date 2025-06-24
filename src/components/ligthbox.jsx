import React, { useState } from "react";

const Lightbox = ({ isOpen, closeLightbox, currentImage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000e5] flex flex-col justify-center items-center z-50" style={{ height: '100vh', overflow: 'hidden' }}
    >
    <div className="w-full bg-[black] h-[7vh] flex items-center justify-between text-white px-[2rem]">
        <p>Preview-Fullscreen</p>
        <button
          className=" text-white text-[2rem] "
          onClick={closeLightbox}
        >
          ×
        </button>
    </div>
      <div className="relative w-full px-[1rem] lg:px-0 flex-grow py-[3rem] gap-4 flex flex-col justify-center items-center overflow-hidden">
      <img className="object-contain max-h-full max-w-full" src={currentImage} alt="Imagen en detalle"/>
       
      </div>
    </div>
  );
};

export default Lightbox;
