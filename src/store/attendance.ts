import { Module } from "vuex";
import { db, studentAttendancesCol, studentsCol } from "@/firebase/config";
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
    // async checkRecord({ commit, dispatch }, { name, grade, group, date }) {
    //   const q = query(
    //     studentAttendancesCol,
    //     where("teacher", "==", name),
    //     where("date", "==", date)
    //   );
    //   const checkRecordResponse = await getDocs(q);
    //   if (checkRecordResponse.docs.length > 0) {
    //     // 출석 입력 기록 O
    //     const assignedStudents: Student[] = checkRecordResponse.docs.map(
    //       (doc) => ({
    //         ...(doc.data() as Student),
    //         id: doc.id,
    //       })
    //     );
    //     commit("SET_STUDENTS", assignedStudents);
    //     commit("SET_HAS_RECORD", true);
    //   } else {
    //     // 출석 입력 기록 X
    //     dispatch("fetchStudentsByTeacher", { name, grade, group });
    //     commit("SET_HAS_RECORD", false);
    //   }
    // },

    // async fetchStudents({ commit }) {
    //   const querySnapshot = await getDocs(studentsCol);
    //   const students = querySnapshot.docs.map((doc) => doc.data());
    //   commit("SET_STUDENTS", students);
    // },

    // async fetchStudentsByTeacher({ commit }, { name, grade, group }) {
    //   const assignedStudents: Student[] = [];
    //   const q = query(
    //     studentsCol,
    //     where("teacher", "==", name),
    //     where("grade", "==", grade),
    //     where("group", "==", group)
    //   );
    //   const querySnapshot = await getDocs(q);
    //   querySnapshot.forEach((doc) => {
    //     assignedStudents.push({
    //       id: doc.id,
    //       name: doc.data().name,
    //       birth: doc.data().birth,
    //       attendance: "online",
    //     });
    //   });
    //   commit("SET_STUDENTS", assignedStudents);
    // },

    // async fetchAttendanceStudentsDaily({ commit, state }, { date }) {
    //   const result = await Promise.all(
    //     state.students.map(async (student) => {
    //       const q = query(
    //         studentAttendancesCol,
    //         where("name", "==", student.name),
    //         where("grade", "==", student.grade),
    //         where("group", "==", student.group),
    //         where("teacher", "==", student.teacher),
    //         where("date", "==", date)
    //       );

    //       const response = await getDocs(q);

    //       if (response.docs.length > 0) {
    //         return response.docs[0].data();
    //       } else {
    //         const temp = {
    //           group: student.group,
    //           grade: student.grade,
    //           teacher: student.teacher,
    //           name: student.name,
    //           birth: student.birth,
    //           attendance: "none",
    //         };
    //         return temp;
    //       }
    //     })
    //   );
    //   commit("SET_ATTENDANCE_STUDENTS_DAILY", result);
    // },

    async addStudentsAttendanceStatus(context, payload) {
      if (payload.recordId) {
        const id = payload.recordId;
        delete payload.recordId;
        await setDoc(doc(db, "studentAttendances", id), payload);
      } else {
        await addDoc(studentAttendancesCol, payload);
      }
    },

    // 리팩토링
    async fetchStudentAttendances(context, payload) {
      const q = query(
        studentAttendancesCol,
        where("date", "==", payload.date),
        where("grade", "==", payload.grade),
        where("group", "==", payload.group)
      );
      const fetchStudentAttendancesResponse = await getDocs(q);

      // 입력된 출석현황이 있어서 그 결과를 붙여줌
      if (fetchStudentAttendancesResponse.docs.length > 0) {
        context.commit(
          "SET_TEACHER_ATTENDANCE",
          fetchStudentAttendancesResponse.docs[0].data().teacherAttendance
        );
        const fetchStudentAttendancesResult = {
          id: fetchStudentAttendancesResponse.docs[0].id,
          ...fetchStudentAttendancesResponse.docs[0].data(),
        };
        return fetchStudentAttendancesResult;
      }
      // 입력된 출석현황이 없기에 그 결과를 담아줄 템플릿을 건네줌
      else {
        const fetchStudentsByClassResponse = await context.dispatch("fetchStudentsByClass", payload);

        // 템플릿 만들어주기
        const attendancesTemplate = fetchStudentsByClassResponse.docs.map((doc) => ({
          teacher: doc.data().teacher,
          grade: doc.data().grade,
          group: doc.data().group,
          name: doc.data().name,
          attendance: "",
        }));
        const fetchStudentAttendancesResult = {
          id: "",
          attendances: attendancesTemplate,
        };
        return fetchStudentAttendancesResult;
      }
    },

    async fetchStudentsByClass(context, payload) {
      const q = query(studentsCol, where("grade", "==", payload.grade), where("group", "==", payload.group));
      const fetchStudentsByClassResponse = await getDocs(q);
      return fetchStudentsByClassResponse;
    },
  },
};

// const sortByName = (assignedStudents: Student[]) => {
//   assignedStudents.sort((a, b) =>
//     a.name > b.name ? 1 : b.name > a.name ? -1 : 0
//   );
//   return assignedStudents;
// };
