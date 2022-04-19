import { Module } from "vuex";
import {
  db,
  attendancesCol,
  studentsCol,
  teachersCol,
} from "@/firebase/config";
import { addDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { RootState, AttendanceState, Student } from "@/store/types";

export const attendance: Module<AttendanceState, RootState> = {
  namespaced: true,
  state: () => ({
    students: [],
    teachers: [],
    hasRecord: false,
    attendanceStudentsDaily: null,
  }),

  mutations: {
    SET_STUDENTS(state, payload) {
      state.students = payload;
    },
    SET_ATTENDANCE_STUDENTS_DAILY(state, payload) {
      state.attendanceStudentsDaily = payload;
    },
    SET_TEACHERS(state, payload) {
      state.teachers = payload;
    },
    SET_HAS_RECORD(state, payload) {
      state.hasRecord = payload;
    },
  },

  actions: {
    // async checkRecord({ commit, dispatch }, { name, grade, group, date }) {
    //   const q = query(
    //     attendancesCol,
    //     where("teacher", "==", name),
    //     where("date", "==", date)
    //   );
    //   const checkRecordResponse = await getDocs(q);
    //   if (checkRecordResponse.docs.length > 0) {
    //     // 출석 입력 기록 O
    //     let assignedStudents: Student[] = checkRecordResponse.docs.map(
    //       (doc) => ({
    //         ...(doc.data() as Student),
    //         id: doc.id,
    //       })
    //     );
    //     assignedStudents = sortByName(assignedStudents);
    //     commit("SET_STUDENTS", assignedStudents);
    //     commit("SET_HAS_RECORD", true);
    //   } else {
    //     // 출석 입력 기록 X
    //     dispatch("fetchStudents", { name, grade, group });
    //     commit("SET_HAS_RECORD", false);
    //   }
    // },

    // async fetchStudents({ commit }, { name, grade, group }) {
    //   let assignedStudents: Student[] = [];
    //   const q = query(
    //     studentsCol,
    //     where("teacher", "==", name),
    //     where("grade", "==", grade),
    //     where("group", "==", group)
    //   );
    //   const querySnapshot = await getDocs(q);
    //   querySnapshot.forEach((doc) => {
    //     assignedStudents.push({
    //       // id: doc.id
    //       name: doc.data().name,
    //       birth: doc.data().birth,
    //       attendance: "online",
    //     });
    //   });
    //   assignedStudents = sortByName(assignedStudents);
    //   commit("SET_STUDENTS", assignedStudents);
    // },

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

    // async fetchTeachers({ commit }) {
    //   const querySnapshot = await getDocs(teachersCol);
    //   const teachers = querySnapshot.docs.map((doc) => doc.data());
    //   commit("SET_TEACHERS", teachers);
    // },

    async fetchStudents({ commit }) {
      const querySnapshot = await getDocs(studentsCol);
      const students = querySnapshot.docs.map((doc) => doc.data());
      commit("SET_STUDENTS", students);
    },

    async fetchAttendanceStudentsDaily({ commit, state }, { date }) {
      const result = await Promise.all(
        state.students.map(async (student) => {
          const q = query(
            attendancesCol,
            where("name", "==", student.name),
            where("grade", "==", student.grade),
            where("group", "==", student.group),
            where("teacher", "==", student.teacher),
            where("date", "==", date)
          );

          const response = await getDocs(q);

          if (response.docs.length > 0) {
            return response.docs[0].data();
          } else {
            const temp = {
              group: student.group,
              grade: student.grade,
              teacher: student.teacher,
              name: student.name,
              birth: student.birth,
              attendance: "미입력",
            };
            return temp;
          }
        })
      );
      commit("SET_ATTENDANCE_STUDENTS_DAILY", result);
    },
  },
};

const sortByName = (assignedStudents: Student[]) => {
  assignedStudents.sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  );
  return assignedStudents;
};
