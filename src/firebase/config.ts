import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPKREFtu36CcmILDCh2m5JQloFuKNyi0o",
  authDomain: "the-shack-backend.firebaseapp.com",
  projectId: "the-shack-backend",
  storageBucket: "the-shack-backend.appspot.com",
  messagingSenderId: "53415125040",
  appId: "1:53415125040:web:157fb9483feccfe8b40df5",
  measurementId: "G-5HQ64ZGGWJ",
};

// init firebase
initializeApp(firebaseConfig);

// init firebase auth
const auth = getAuth();

// init service
const db = getFirestore();

// collection ref
const usersCol = collection(db, "users");

export { auth, db, usersCol };
