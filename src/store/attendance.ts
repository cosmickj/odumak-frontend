import { Module } from "vuex";
import { db, studentsAttendanceCol, studentsCol, teacherAttendanceCol, teachersCol } from "@/firebase/config";
import { addDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { RootState, AttendanceState } from "@/store/types";

export const attendance: Module<AttendanceState, RootState> = {
  namespaced: true,
  state: () => ({
    teacherAttendance: "online",
  }),

  mutations: {
    SET_TEACHER_ATTENDANCE(state, payload) {
      state.teacherAttendance = payload;
    },
  },

  actions: {
    async fetchAllStudents() {
      const querySnapshot = await getDocs(studentsCol);
      const result = querySnapshot.docs.map((doc) => ({
        grade: doc.data().grade,
        group: doc.data().group,
        name: doc.data().name,
        teacher: doc.data().teacher,
        attendance: "",
      }));
      return result;
    },

    async fetchStudentAttendancesByDate(context, payload) {
      const q = query(studentsAttendanceCol, where("date", "==", payload.date));
      const res = await getDocs(q);
      const result = res.docs.map((value) => value.data().studentsAttendance);
      return result.flat();
    },

    // async fetchTeacherAttendancesByDate(context, payload) {
    //   const q = query(attendancesCol, where("date", "==", payload.date));
    //   const res = await getDocs(q);
    //   const result = res.docs.map((value) => ({
    //     grade: value.data().grade,
    //     group: value.data().group,
    //     name: value.data().teacher,
    //     attendance: value.data().teacherAttendance,
    //   }));
    //   return result;
    // },

    async fetchStudentsAttendance(context, payload) {
      const q = query(
        studentsAttendanceCol,
        where("date", "==", payload.date),
        where("grade", "==", payload.grade),
        where("group", "==", payload.group)
      );
      const fetchStudentsAttendanceResponse = await getDocs(q);

      if (fetchStudentsAttendanceResponse.docs.length > 0) {
        const result = {
          recordId: fetchStudentsAttendanceResponse.docs[0].id,
          ...fetchStudentsAttendanceResponse.docs[0].data(),
        };
        return result;
      } else {
        const fetchStudentsByClassResponse = await context.dispatch("fetchStudentsByClass", payload);

        const initStudentsAttendance = fetchStudentsByClassResponse.docs.map((doc: any) => ({
          teacher: doc.data().teacher,
          grade: doc.data().grade,
          group: doc.data().group,
          name: doc.data().name,
          attendance: "",
        }));

        const result = { recordId: "", studentsAttendance: [...initStudentsAttendance] };
        return result;
      }
    },

    async fetchStudentsByClass(context, payload) {
      const q = query(studentsCol, where("grade", "==", payload.grade), where("group", "==", payload.group));
      const fetchStudentsByClassResponse = await getDocs(q);
      return fetchStudentsByClassResponse;
    },

    async addStudentsAttendance(context, payload) {
      if (payload.recordId) {
        const docId = payload.recordId;
        delete payload.recordId;
        await setDoc(doc(db, "studentsAttendance", docId), payload);
      } else {
        delete payload.recordId;
        const result = await addDoc(studentsAttendanceCol, payload);
        return result;
      }
    },

    async fetchTeachersAttendance(context, payload) {
      const q = query(teacherAttendanceCol, where("date", "==", payload.date));
      const fetchTeachersAttendanceResponse = await getDocs(q);

      if (fetchTeachersAttendanceResponse.docs.length > 0) {
        console.log("저장된 데이터 있음");
      } else {
        // ALL TEACHERS
        const querySnapshot = await getDocs(teachersCol);
        const result = querySnapshot.docs.map((doc) => ({
          name: doc.data().name,
          attendance: "",
        }));
        return result;
      }
    },
  },
};
