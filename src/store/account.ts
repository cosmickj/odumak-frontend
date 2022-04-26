import { auth, db } from "@/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Module } from "vuex";
import { AccountState, RootState } from "@/store/types";

export const account: Module<AccountState, RootState> = {
  namespaced: true,

  state: () => ({
    user: null,
    authIsReady: false,
  }),

  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_AUTH_IS_READY(state, payload) {
      state.authIsReady = payload;
    },
  },

  actions: {
    async signup(_context, { email, password, name }) {
      try {
        const signupResponse = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(signupResponse.user, { displayName: name });
        return signupResponse;
      } catch (error) {
        throw new Error("could not complete signup");
      }
    },
    async createUser(_context, { uid, grade, group }) {
      try {
        await setDoc(doc(db, "users", uid), {
          grade,
          group,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        throw new Error("could not complete creating a user");
      }
    },
    async login({ commit, dispatch }, { email, password }) {
      try {
        const loginResponse = await signInWithEmailAndPassword(auth, email, password);
        const fetchUserResponse = await dispatch("fetchUser", loginResponse.user.uid);
        commit("SET_USER", {
          name: loginResponse.user.displayName,
          email: loginResponse.user.email,
          uid: loginResponse.user.uid,
          ...fetchUserResponse,
        });
      } catch (error) {
        throw new Error("could not complete login");
      }
    },
    async fetchUser(_context, uid) {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
      }
    },
    async logout({ commit }) {
      await signOut(auth);
      commit("SET_USER", null);
    },
  },
};
