import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
// import { computed, onMounted, onUnmounted, ref } from "vue";

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

// export const useAuthState = () => {
//   const user = ref(null);
//   const error = ref(null);
//   let unsubscribe: any;
//   onMounted(() => {
//     unsubscribe = onAuthStateChanged(
//       auth,
//       (u) => (user.value = u),
//       (e) => (error.value = e)
//     );
//   });
//   onUnmounted(() => unsubscribe());
//   const isAuthenticated = computed(() => user.value != null);
//   return { user, error, isAuthenticated };
// };

// NOTE: onAuthStateChanged를 Promise 객체로 만들어서 async/await을 사용함
export const getUserState = () =>
  new Promise((resolve, reject) => onAuthStateChanged(auth, resolve, reject));

// init service
const db = getFirestore();

// collection ref
const usersCol = collection(db, "users");
const studentsCol = collection(db, "students");
const attendancesCol = collection(db, "attendances");

export { auth, db, usersCol, studentsCol, attendancesCol };
