import { Module } from "vuex";
import { RootState } from "./index";
import { attendancesCol, studentsCol } from "@/firebase/config";
import { getDocs, onSnapshot, query, where } from "firebase/firestore";

export interface AttendanceState {
  students: any;
  record: any;
  studentsDailyAttendance: any;
}
export const attendance: Module<AttendanceState, RootState> = {
  namespaced: true,
  state: () => ({
    students: null,
    record: null,
    studentsDailyAttendance: null,
  }),

  mutations: {
    SET_STUDENTS(state, payload) {
      state.students = payload;
    },
    SET_RECORD(state, payload) {
      state.record = payload;
    },
    SET_STUDENTS_DAILY_ATTENDANCE(state, payload) {
      console.log(payload);

      state.studentsDailyAttendance = payload;
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
        commit("SET_RECORD", result.docs[0].id);
      } else {
        // 출석 입력 기록 X
        dispatch("fetchStudents", { name });
        commit("SET_RECORD", null);
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

    async fetchStudentsDailyAttendance({ commit }, { date }) {
      const result = [];
      const q = query(attendancesCol, where("date", "==", date));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        result.push(...doc.data().students);
      });
      commit("SET_STUDENTS_DAILY_ATTENDANCE", result);
    },
  },
};
