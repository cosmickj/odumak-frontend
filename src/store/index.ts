import { createStore } from "vuex";

// firebase import
import { auth, usersCol } from "@/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { onSnapshot, query, where } from "firebase/firestore";

const store = createStore({
  state: {
    user: null,
    // userName: "",
    authIsReady: false,
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    // SET_USERNAME(state, payload) {
    //   state.userName = payload;
    // },
    SET_AUTH_IS_READY(state, payload) {
      state.authIsReady = payload;
    },
  },
  actions: {
    async signup(context, { email, password }) {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (res) {
        context.commit("SET_USER", res.user);
      } else {
        throw new Error("could not complete signup");
      }
    },
    async login(context, { email, password }) {
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (res) {
        context.commit("SET_USER", res.user);
      } else {
        throw new Error("could not complete login");
      }
    },
    async logout(context) {
      await signOut(auth);
      context.commit("SET_USER", null);
    },
    // async fetchUserName(context) {
    //   const q = query(usersCol, where("email", "==", this.state.user["email"]));
    //   onSnapshot(q, (snapshot) => {
    //     const users = [];
    //     snapshot.docs.forEach((doc) => {
    //       users.push({ ...doc.data(), id: doc.id });
    //     });
    //     context.commit("SET_USERNAME", users[0].name);
    //   });
    // },
  },
});

// Waiting for Auth to be Ready
const unsub = onAuthStateChanged(auth, (user) => {
  store.commit("SET_AUTH_IS_READY", true);
  store.commit("SET_USER", user);
  unsub();
});

export default store;
