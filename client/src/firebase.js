// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-api-a9c81.firebaseapp.com",
  projectId: "blog-api-a9c81",
  storageBucket: "blog-api-a9c81.appspot.com",
  messagingSenderId: "163008771114",
  appId: "1:163008771114:web:c304a7f0c2a93bd7aaff53"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);