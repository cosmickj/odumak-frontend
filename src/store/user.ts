import { auth, db } from "@/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Module } from "vuex";
import { RootState } from ".";

export interface UserState {
  auth: any;
  info: any;
  authIsReady: any;
}

export const user: Module<UserState, RootState> = {
  namespaced: true,
  state: () => ({
    auth: null,
    info: null,
    authIsReady: false,
  }),
  mutations: {
    SET_USER(state, payload) {
      state.auth = payload;
    },
    SET_USER_INFO(state, payload) {
      state.info = payload;
    },
    SET_AUTH_IS_READY(state, payload) {
      state.authIsReady = payload;
    },
  },
  actions: {
    async signup(_context, { email, password, name }) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: name });
        console.log(res);
      } catch (error) {
        throw new Error("could not complete signup");
      }
    },
    // async addUser() {

    // },
    async login({ commit }, { email, password }) {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);

      // const res = await signInWithEmailAndPassword(auth, email, password);
      // if (res) {
      //   commit("SET_USER", res.user);
      //   localStorage.setItem("uid", JSON.stringify({ uid: res.user.uid }));
      // } else {
      //   throw new Error("could not complete login");
      // }
    },

    async logout({ commit }) {
      await signOut(auth);
      commit("SET_USER", null);
      commit("SET_USER_INFO", null);
      localStorage.removeItem("uid");
    },

    fetchUserInfo({ commit }) {
      const result = localStorage.getItem("uid");
      if (result !== null) {
        const uid = JSON.parse(result).uid;
        const docRef = doc(db, "users", uid);
        onSnapshot(docRef, (doc) => {
          commit("SET_USER_INFO", { ...doc.data(), uid: doc.id });
        });
      }
    },
  },
};
