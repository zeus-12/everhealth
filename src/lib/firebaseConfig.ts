import { initializeApp } from 'firebase/app';
import {getFirestore} from "firebase/firestore";


// Initialize Firebase

const firebaseConfig = {
    apiKey: "AIzaSyDU3wBxXPBgCc29TzuanzQ6z3IZ_GBq9g4",
    authDomain: "gfg-hackathon-007.firebaseapp.com",
    projectId: "gfg-hackathon-007",
    storageBucket: "gfg-hackathon-007.appspot.com",
    messagingSenderId: "118987800703",
    appId: "1:118987800703:web:4fca79b9ce7fefb4f17f4a"
  };

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB= getFirestore(FIREBASE_APP);
