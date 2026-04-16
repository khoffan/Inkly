// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_vx69kw52H-s2zFQBHz_6gL49yo9AOAY",
  authDomain: "inkly-fde7f.firebaseapp.com",
  projectId: "inkly-fde7f",
  storageBucket: "inkly-fde7f.firebasestorage.app",
  messagingSenderId: "393743953478",
  appId: "1:393743953478:web:f56a03f952308b2ee12447",
  measurementId: "G-X34LB3TDEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);