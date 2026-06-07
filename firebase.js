import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1SpDBJBP8f-le_6R_1Stqw1VovOJV5Nk",
  authDomain: "road-renegade.firebaseapp.com",
  projectId: "road-renegade",
  storageBucket: "road-renegade.firebasestorage.app",
  messagingSenderId: "580114510835",
  appId: "1:580114510835:web:c33aad2cfb2de335a09886"
};

const app = initializeApp(firebaseConfig);

export const auth =
    getAuth(app);

export const db =
    getFirestore(app);

import {
    GoogleAuthProvider,
    signInWithPopup
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    doc,
    setDoc
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

await setDoc(
    doc(
        db,
        "users",
        result.user.uid
    ),
    {
        username:
            result.user.displayName,

        bounty: 0,

        bestScore: 0
    },
    {
        merge: true
    }
);

await updateDoc(
    doc(
        db,
        "users",
        currentUser.uid
    ),
    {
        bounty:
            increment(score),

        bestScore:
            Math.max(
                oldBest,
                score
            )
    }
);
