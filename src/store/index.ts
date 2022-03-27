import { createStore } from "vuex";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { user, UserState } from "./user";
import { attendance, AttendanceState } from "./attendance";

export interface RootState {
  User: UserState;
  Attendance: AttendanceState;
}

const store = createStore({
  modules: {
    attendance,
    user,
  },
});

// Waiting for Auth to be Ready
const unsub = onAuthStateChanged(auth, (user) => {
  store.commit("user/SET_AUTH_IS_READY", true);
  store.commit("user/SET_USER", user);
  unsub();
});

export default store;
