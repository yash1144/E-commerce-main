// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCbb051M4MOjLW2U7xhh0xo3PD31GuoZQ",
  authDomain: "e-commerce-68dc1.firebaseapp.com",
  projectId: "e-commerce-68dc1",
  storageBucket: "e-commerce-68dc1.firebasestorage.app",
  messagingSenderId: "238398225021",
  appId: "1:238398225021:web:b45387abfc65b455890f14",
  measurementId: "G-346T3RBZHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider  = new GoogleAuthProvider();