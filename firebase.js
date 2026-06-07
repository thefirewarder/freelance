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

const firebaseConfig = {
    // config
};

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
