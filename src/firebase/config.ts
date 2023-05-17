import { Collection } from '@/enums';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
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
export const attendancesColl = collection(db, Collection.ATTENDANCES);
export const membersColl = collection(db, Collection.MEMBERS);
export const usersColl = collection(db, Collection.USERS);
