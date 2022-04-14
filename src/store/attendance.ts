import { Module } from "vuex";
import { attendancesCol, studentsCol } from "@/firebase/config";
import { getDocs, query, where } from "firebase/firestore";
import { RootState, AttendanceState } from "@/store/types";
import { Student, StudentAttendance } from "@/types/index";

export const attendance: Module<AttendanceState, RootState> = {
  namespaced: true,
  state: () => ({
    students: null,
    record: null,
    studentsDailyAttendance: [],
  }),

  mutations: {
    SET_STUDENTS(state, payload) {
      state.students = payload;
    },
    SET_RECORD(state, payload) {
      state.record = payload;
    },
    SET_STUDENTS_DAILY_ATTENDANCE(state, payload) {
      state.studentsDailyAttendance = payload;
    },
  },

  actions: {
    async checkRecord({ commit, dispatch }, { name, grade, group, date }) {
      const q = query(
        attendancesCol,
        where("teacher", "==", name),
        where("date", "==", date)
      );
      const checkRecordResponse = await getDocs(q);
      if (checkRecordResponse.docs.length === 1) {
        // 출석 입력 기록 O
        const assignedStudents = checkRecordResponse.docs[0].data().students;
        commit("SET_STUDENTS", assignedStudents);
        commit("SET_RECORD", checkRecordResponse.docs[0].id);
      } else {
        // 출석 입력 기록 X
        dispatch("fetchStudents", { name, grade, group });
        commit("SET_RECORD", null);
      }
    },
    async fetchStudents({ commit }, { name, grade, group }) {
      const assignedStudents: Student[] = [];
      const q = query(
        studentsCol,
        where("teacher", "==", name),
        where("grade", "==", grade),
        where("group", "==", group)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        assignedStudents.push({
          // id: doc.id
          name: doc.data().name,
          birth: doc.data().birth,
          attendance: "online",
        });
      });
      commit("SET_STUDENTS", assignedStudents);

      /* 실시간 변경 추적 코드
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
      */
    },

    async fetchStudentsDailyAttendance({ commit }, { date }) {
      const result: StudentAttendance[] = [];
      const q = query(attendancesCol, where("date", "==", date));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        result.push(...doc.data().students);
      });
      commit("SET_STUDENTS_DAILY_ATTENDANCE", result);
    },
  },
};
