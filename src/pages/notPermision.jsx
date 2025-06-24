import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function notPermision() {
const [ip, setIP] = useState("");

useEffect(() => {
async function fetchIP() {
    try {
        const response = await axios.get("https://api.ipify.org?format=json");
            setIP(response.data.ip);
    } catch (error) {
        console.error("Error fetching IP:", error);
    }
}
fetchIP();
}, []);
return (
<div className='w-full h-screen flex justify-center items-center'>
    <div className='flex flex-col items-center'>
        <p className='text-[12rem] font-semibold'>403</p>
        <p>No tienes acceso a esta página, tu ip quedará registrada en nuestra base de datos y analizaremos tu caso,</p>
        <p>Si crees que se trata de un error, por favor consultalo con el administrador de la página</p>
        <p className='font-semibold'>Tu IP: {ip}</p>
    </div>
</div>
);}
