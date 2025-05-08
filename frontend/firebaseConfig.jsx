
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRSY4E-ZWlAN8WOfMmc-9shM-nXj5uO68",
  authDomain: "ai-trip-planner-0.firebaseapp.com",
  projectId: "ai-trip-planner-0",
  storageBucket: "ai-trip-planner-0.firebasestorage.app",
  messagingSenderId: "1012305383548",
  appId: "1:1012305383548:web:6127c4be17ae6b297ab9f9",
  measurementId: "G-M1BJVZBK6B",
  
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);