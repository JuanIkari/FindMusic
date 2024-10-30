// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { TOKEN } from "@env";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: TOKEN,
  authDomain: "findmusic-60740.firebaseapp.com",
  projectId: "findmusic-60740",
  storageBucket: "findmusic-60740.appspot.com",
  messagingSenderId: "201924004366",
  appId: "1:201924004366:web:279c42b0f316974068ca5f",
  measurementId: "G-K3SKPL7TDW",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;
