// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZm2fMAZ_eJVitDsPSlCcTozQr0WDIC2s",
  authDomain: "aplicacion-web-e113f.firebaseapp.com",
  projectId: "aplicacion-web-e113f",
  storageBucket: "aplicacion-web-e113f.appspot.com",
  messagingSenderId: "128248423905",
  appId: "1:128248423905:web:2b02d16d9f73229b279ea0"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase