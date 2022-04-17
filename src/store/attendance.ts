import { Module } from "vuex";
import { attendancesCol, db, studentsCol } from "@/firebase/config";
import { addDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { RootState, AttendanceState } from "@/store/types";
import { Student } from "@/types/index";

const sortByName = (assignedStudents: Student[]) => {
  assignedStudents.sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  );
  return assignedStudents;
};

export const attendance: Module<AttendanceState, RootState> = {
  namespaced: true,
  state: () => ({
    students: [],
    hasRecord: false,
  }),

  mutations: {
    SET_STUDENTS(state, payload) {
      state.students = payload;
    },
    SET_HAS_RECORD(state, payload) {
      state.hasRecord = payload;
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

      if (checkRecordResponse.docs.length > 0) {
        // 출석 입력 기록 O
        let assignedStudents: Student[] = checkRecordResponse.docs.map(
          (doc) => ({
            ...(doc.data() as Student),
            id: doc.id,
          })
        );
        assignedStudents = sortByName(assignedStudents);
        commit("SET_STUDENTS", assignedStudents);
        commit("SET_HAS_RECORD", true);
      } else {
        // 출석 입력 기록 X
        dispatch("fetchStudents", { name, grade, group });
        commit("SET_HAS_RECORD", false);
      }
    },
    async fetchStudents({ commit }, { name, grade, group }) {
      let assignedStudents: Student[] = [];
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
      assignedStudents = sortByName(assignedStudents);

      commit("SET_STUDENTS", assignedStudents);
    },
    async addStudentsAttendanceStatus(_context, payload) {
      if (!payload[0].id) {
        for (const studenAttendanceStatus of payload) {
          await addDoc(attendancesCol, studenAttendanceStatus);
        }
      } else {
        for (const studenAttendanceStatus of payload) {
          await setDoc(doc(db, "attendances", studenAttendanceStatus.id), {
            ...studenAttendanceStatus,
          });
        }
      }
    },

    // async fetchStudentsDailyAttendance({ commit }, { date }) {
    //   const result: StudentAttendance[] = [];
    //   const q = query(attendancesCol, where("date", "==", date));
    //   const querySnapshot = await getDocs(q);
    //   querySnapshot.forEach((doc) => {
    //     result.push(...doc.data().students);
    //   });
    //   commit("SET_STUDENTS_DAILY_ATTENDANCE", result);
    // },
  },
};
