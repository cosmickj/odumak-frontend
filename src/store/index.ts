import { createStore } from "vuex";

// firebase import
import { auth } from "@/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const store = createStore({
  state: {
    user: null,
    authIsReady: false,

    // Total Attendace Data
    totalAttendaces: [
      {
        class: "3-1",
        online: 3,
        offline: 1,
        absence: 2,
        percent: 66,
      },
      {
        class: "3-2",
        online: 3,
        offline: 1,
        absence: 2,
        percent: 66,
      },
      {
        class: "3-3",
        online: 3,
        offline: 1,
        absence: 2,
        percent: 66,
      },
      {
        class: "3-4",
        online: 3,
        offline: 1,
        absence: 2,
        percent: 66,
      },
      {
        class: "3-5",
        online: 3,
        offline: 1,
        absence: 2,
        percent: 66,
      },
    ],
    totalAttendaceFields: [
      { key: "class", label: "학년(반)", sortable: true, stickyColumn: true },
      { key: "online", label: "온라인", sortable: true },
      { key: "offline", label: "현장", sortable: true },
      { key: "absence", label: "미참여", sortable: true },
      { key: "percent", label: "출석율", sortable: true },
    ],
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
      console.log("user state changed:", state.user);
    },
    setAuthIsReady(state, payload) {
      state.authIsReady = payload;
    },
  },
  actions: {
    async signup(context, { email, password }) {
      console.log("signup action");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (res) {
        context.commit("setUser", res.user);
      } else {
        throw new Error("could not complete signup");
      }
    },

    async login(context, { email, password }) {
      console.log("login action");
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (res) {
        context.commit("setUser", res.user);
      } else {
        throw new Error("could not complete login");
      }
    },

    async logout(context) {
      console.log("logout action");
      await signOut(auth);
      context.commit("setUser", null);
    },
  },
});

const unsub = onAuthStateChanged(auth, (user) => {
  store.commit("setAuthIsReady", true);
  store.commit("setUser", user);
  unsub();
});

export default store;
