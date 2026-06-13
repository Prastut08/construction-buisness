// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBS12lXj7FPakTivyNt7EFhYMDr0XkZ8E0",
  authDomain: "buisness-mama.firebaseapp.com",
  projectId: "buisness-mama",
  storageBucket: "buisness-mama.firebasestorage.app",
  messagingSenderId: "798312564739",
  appId: "1:798312564739:web:0756f351ec5e52e6a32636",
  measurementId: "G-H810ZPW3L1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;