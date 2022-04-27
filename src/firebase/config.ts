import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
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
export const usersCol = collection(db, "users");
export const studentsCol = collection(db, "students");
export const attendancesCol = collection(db, "attendances");

// export const teacherAttendancesCol = collection(db, "teacherAttendances");
// export const studentAttendancesCol = collection(db, "studentAttendances");
