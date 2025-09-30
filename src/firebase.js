// Firebase configuration - Latest version with proper imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBX2bZmOUosU-2PXZFQVN_WLLuee_zkFzI",
  authDomain: "unschooling-464413.firebaseapp.com",
  projectId: "unschooling-464413",
  storageBucket: "unschooling-464413.appspot.com",
  messagingSenderId: "790275794964",
  appId: "1:790275794964:web:f981a7f0693cc186631f01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };