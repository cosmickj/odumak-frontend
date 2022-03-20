import { Module } from "vuex";
import { RootState } from "./index";
import { attendancesCol, studentsCol } from "@/firebase/config";
import { getDocs, onSnapshot, query, where } from "firebase/firestore";

export interface AttendanceState {
  stage: string;
  students: any;
  records: any;
}
export const attendance: Module<AttendanceState, RootState> = {
  namespaced: true,
  state: () => ({
    stage: "",
    students: null,
    records: null,
  }),
  mutations: {
    SET_STAGE(state, payload) {
      state.stage = payload;
    },
    SET_STUDENTS(state, payload) {
      state.students = payload;
    },
    SET_RECORDS(state, payload) {
      state.records = payload;
    },
  },
  actions: {
    async checkRecord({ commit, dispatch }, { name, date }) {
      const q = query(
        attendancesCol,
        where("teacher", "==", name),
        where("date", "==", date)
      );
      const result = await getDocs(q);
      if (result.docs.length === 1) {
        // 출석 입력 기록 O
        const students = result.docs[0].data().students;
        commit("SET_STUDENTS", students);
        commit("SET_RECORDS", result.docs[0].id);
      } else {
        // 출석 입력 기록 X
        dispatch("fetchStudents", { name });
        commit("SET_RECORDS", null);
      }
    },
    fetchStudents({ commit }, { name }) {
      const q = query(studentsCol, where("teacher", "==", name));
      onSnapshot(q, (querySnapshot) => {
        const result: any = [];
        querySnapshot.forEach((doc) => {
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
};
