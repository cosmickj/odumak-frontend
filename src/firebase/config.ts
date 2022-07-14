import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// init firebase
initializeApp(firebaseConfig);

// init firebase auth
export const auth = getAuth();

// router auth checker
export const getUserState = () => new Promise((resolve, reject) => onAuthStateChanged(auth, resolve, reject));

// init service
export const db = getFirestore();
// collection ref
export const usersCol = collection(db, 'users');
export const studentsAttendanceCol = collection(db, 'studentsAttendance');
export const teachersAttendanceCol = collection(db, 'teachersAttendance');
