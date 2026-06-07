import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    getFirestore
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1SpDBJBP8f-le_6R_1Stqw1VovOJV5Nk",
  authDomain: "road-renegade.firebaseapp.com",
  projectId: "road-renegade",
  storageBucket: "road-renegade.firebasestorage.app",
  messagingSenderId: "580114510835",
  appId: "1:580114510835:web:c33aad2cfb2de335a09886"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const app =
    initializeApp(firebaseConfig);

export const auth =
    getAuth(app);

export const db =
    getFirestore(app);

const provider =
    new GoogleAuthProvider();

export async function login(){

    const result =
        await signInWithPopup(
            auth,
            provider
        );

    return result.user;
}
