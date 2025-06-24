// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {v4} from 'uuid'

const firebaseConfig = {
  apiKey: "AIzaSyA6TUymcMktit34OcH7bPSLxh7ber1Vofg",
  authDomain: "tienda-elgestormx.firebaseapp.com",
  projectId: "tienda-elgestormx",
  storageBucket: "tienda-elgestormx.appspot.com",
  messagingSenderId: "697242918943",
  appId: "1:697242918943:web:2ead58e32625b9557a752a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app)

export async function uploadFoto_INE(file) {
    const storageRef = ref(storage, `RENTAME CARMEN${v4()}`);
  
    try {
      // Subir el archivo a Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
  
      // Obtener la URL de descarga del archivo
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      console.log( downloadURL);
      
      return downloadURL; // Devolver la URL de descarga
    } catch (error) {
      console.error("Error al cargar el archivo:", error);
      throw error;
    }
  }