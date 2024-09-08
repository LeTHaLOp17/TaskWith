// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2TUn_FUzggR4tZnctiZ82mHPBca9700k",
  authDomain: "taskwith-90441.firebaseapp.com",
  projectId: "taskwith-90441",
  storageBucket: "taskwith-90441.appspot.com",
  messagingSenderId: "1026580190929",
  appId: "1:1026580190929:web:c0a03042fc48d1d43797f0",
  measurementId: "G-048JXXYNVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db =  getFirestore(app);

