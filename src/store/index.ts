import { createStore } from "vuex";
import { auth, studentsCol, usersCol } from "@/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { onSnapshot, query, where } from "firebase/firestore";
import Student from "@/types/Student";
import UserInfo from "@/types/UserInfo";

export interface State {
  user: any;
  userInfo: UserInfo;
  students: Student[];
  authIsReady: boolean;
}

const store = createStore<State>({
  state: {
    user: null,
    userInfo: {
      name: "",
    },
    students: [],
    authIsReady: false,
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_USERINFO(state, payload) {
      state.userInfo = payload;
    },
    SET_STUDENTS(state, payload) {
      state.students = payload;
    },
    SET_AUTH_IS_READY(state, payload) {
      state.authIsReady = payload;
    },
  },
  actions: {
    async signup({ commit }, { email, password }) {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (res) {
        commit("SET_USER", res.user);
        return res.user.uid;
      } else {
        throw new Error("could not complete signup");
      }
    },
    async login({ commit, dispatch }, { email, password }) {
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (res) {
        localStorage.setItem("uid", JSON.stringify({ uid: res.user.uid }));
        commit("SET_USER", res.user);
        dispatch("fetchUserInfo");
      } else {
        throw new Error("could not complete login");
      }
    },
    async logout({ commit }) {
      await signOut(auth);
      commit("SET_USER", null);
      commit("SET_USERINFO", null);
      localStorage.removeItem("uid");
    },
    fetchUserInfo({ commit }) {
      const result = localStorage.getItem("uid");
      if (result !== null) {
        const uid = JSON.parse(result).uid;
        const q = query(usersCol, where("uid", "==", uid));
        onSnapshot(q, (snapshot) => {
          const users: any = [];
          snapshot.docs.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id });
          });
          commit("SET_USERINFO", { name: users[0].name });
        });
      }
    },
    fetchStudents({ commit }) {
      const q = query(studentsCol, where("teacher", "==", "이경준"));
      onSnapshot(q, (snapshot) => {
        const result: any = [];
        snapshot.docs.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });
        commit("SET_STUDENTS", result);
      });
    },
  },
});

// Waiting for Auth to be Ready
const unsub = onAuthStateChanged(auth, (user) => {
  store.commit("SET_AUTH_IS_READY", true);
  store.commit("SET_USER", user);
  unsub();
});

export default store;
