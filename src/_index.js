// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyA9k5vaB23p3jgI-m00CX0-EzP_9__s2nY",
//   authDomain: "youngeun-backend.firebaseapp.com",
//   projectId: "youngeun-backend",
//   storageBucket: "youngeun-backend.appspot.com",
//   messagingSenderId: "315427468005",
//   appId: "1:315427468005:web:f26ef5b44446731e131a0c",
// };

// // init firebase app
// initializeApp(firebaseConfig);

import {
  // set up
  getFirestore,
  collection,
  onSnapshot,
  getDocs,
  // crud
  addDoc,
  deleteDoc,
  doc,
  // firebase query
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

// init service
const db = getFirestore();

// collection ref
const colRef = collection(db, "books");

// get collection data (just run once)
// getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// queries
const q = query(colRef, orderBy("createdAt"));

// real time collection data (Trigger whenever changes in backend)
onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

// adding documents
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// deleting documents
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

// get a single doc
const docRef = doc(db, "books", "5U9EFYWL9VuUyuMcdM0c");

onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});
