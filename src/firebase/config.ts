import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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

// get firebase auth
export const auth = getAuth();

// connect firebase database
export const db = getFirestore();

// connect firebase database collections
export const usersCol = collection(db, 'users');
export const membersCol = collection(db, 'members');
export const studentsAttendanceCol = collection(db, 'studentsAttendance');
export const teachersAttendanceCol = collection(db, 'teachersAttendance');
