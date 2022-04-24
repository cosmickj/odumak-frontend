import { Module } from "vuex";
import {
  db,
  studentAttendancesCol,
  studentsCol,
  teacherAttendancesCol,
} from "@/firebase/config";
import { addDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { RootState, AttendanceState, Student } from "@/store/types";

export const attendance: Module<AttendanceState, RootState> = {
  namespaced: true,
  state: () => ({
    students: [],
    teacherAttendance: "online",
    hasRecord: false,
    attendanceStudentsDaily: null,
  }),

  mutations: {
    SET_STUDENTS(state, payload) {
      state.students = payload;
    },
    SET_TEACHER_ATTENDANCE(state, payload) {
      state.teacherAttendance = payload;
    },
    SET_ATTENDANCE_STUDENTS_DAILY(state, payload) {
      state.attendanceStudentsDaily = payload;
    },
    SET_HAS_RECORD(state, payload) {
      state.hasRecord = payload;
    },
  },

  actions: {
    // [출석 입력]
    async checkRecord({ commit, dispatch }, { name, grade, group, date }) {
      const q = query(
        studentAttendancesCol,
        where("teacher", "==", name),
        where("date", "==", date)
      );
      const checkRecordResponse = await getDocs(q);
      if (checkRecordResponse.docs.length > 0) {
        // 출석 입력 기록 O
        const assignedStudents: Student[] = checkRecordResponse.docs.map(
          (doc) => ({
            ...(doc.data() as Student),
            id: doc.id,
          })
        );
        commit("SET_STUDENTS", assignedStudents);
        commit("SET_HAS_RECORD", true);
      } else {
        // 출석 입력 기록 X
        dispatch("fetchStudentsByTeacher", { name, grade, group });
        commit("SET_HAS_RECORD", false);
      }
    },

    async fetchStudentsByTeacher({ commit }, { name, grade, group }) {
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
          id: doc.id,
          name: doc.data().name,
          birth: doc.data().birth,
          attendance: "online",
        });
      });
      commit("SET_STUDENTS", assignedStudents);
    },

    async addStudentsAttendanceStatus(context, payload) {
      if (!payload[0].id) {
        // 제출하기
        for (const studenAttendanceStatus of payload) {
          await addDoc(studentAttendancesCol, studenAttendanceStatus);
        }
      } else {
        // 수정하기
        for (const studenAttendanceStatus of payload) {
          await setDoc(
            doc(db, "studentAttendances", studenAttendanceStatus.id),
            {
              ...studenAttendanceStatus,
            }
          );
        }
      }
    },

    async addTeacherAttendanceStatus(context, payload) {
      console.log(payload);
      await addDoc(teacherAttendancesCol, payload);
    },

    // [출석 조회]
    async fetchStudents({ commit }) {
      const querySnapshot = await getDocs(studentsCol);
      const students = querySnapshot.docs.map((doc) => doc.data());
      commit("SET_STUDENTS", students);
    },

    async fetchAttendanceStudentsDaily({ commit, state }, { date }) {
      const result = await Promise.all(
        state.students.map(async (student) => {
          const q = query(
            studentAttendancesCol,
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
              attendance: "none",
            };
            return temp;
          }
        })
      );
      commit("SET_ATTENDANCE_STUDENTS_DAILY", result);
    },
  },
};

// const sortByName = (assignedStudents: Student[]) => {
//   assignedStudents.sort((a, b) =>
//     a.name > b.name ? 1 : b.name > a.name ? -1 : 0
//   );
//   return assignedStudents;
// };
