import { createStore } from "vuex";
import { attendancesCol, auth, db, studentsCol } from "@/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDocs, onSnapshot, query, where } from "firebase/firestore";

// import Student from "@/types/Student";
// import UserInfo from "@/types/UserInfo";
// export interface State {
//   user: any;
//   userInfo: UserInfo;
//   students: Student[];
//   authIsReady: boolean;
// }

// const store = createStore<State>({
const store = createStore({
  state: {
    user: null,
    userInfo: null,
    students: null,
    authIsReady: false,
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_USER_INFO(state, payload) {
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
    async login({ commit }, { email, password }) {
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (res) {
        commit("SET_USER", res.user);
        localStorage.setItem("uid", JSON.stringify({ uid: res.user.uid }));
      } else {
        throw new Error("could not complete login");
      }
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
    async hasRecord(context, { name, date }) {
      const q = query(
        attendancesCol,
        where("teacher", "==", name),
        where("date", "==", date)
      );
      const result = await getDocs(q);
      return result.docs.length;
    },
    fetchStudents({ commit }, { name }) {
      const q = query(studentsCol, where("teacher", "==", name));
      onSnapshot(q, (querySnapshot) => {
        const result: any = [];
        querySnapshot.forEach((doc) => {
          // result.push({ ...doc.data(), id: doc.id });
          result.push({
            name: doc.data().name,
            birth: doc.data().birth,
            attendance: "online",
          });
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
