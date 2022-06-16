import { Module } from "vuex";
import { db, studentsAttendanceCol, studentsCol, teachersAttendanceCol, teachersCol } from "@/firebase/config";
import { addDoc, doc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import { RootState, AttendanceState } from "@/store/types";

export const attendance: Module<AttendanceState, RootState> = {
  namespaced: true,

  state: () => ({
    teacherAttendance: "online",
    totalStudents: [],
    totalTeachers: [],
  }),

  mutations: {
    SET_TEACHER_ATTENDANCE(state, payload) {
      state.teacherAttendance = payload;
    },
    SET_TOTAL_STUDENTS(state, payload) {
      state.totalStudents = payload.totalStudents;
    },
    SET_TOTAL_TEACHERS(state, payload) {
      state.totalTeachers = payload.totalTeachers;
    },
  },

  actions: {
    async fetchAllStudents(context) {
      const querySnapshot = await getDocs(studentsCol);
      const result = querySnapshot.docs.map((doc) => ({
        grade: doc.data().grade,
        group: doc.data().group,
        name: doc.data().name,
        teacher: doc.data().teacher,
        attendance: "",
      }));

      context.commit("SET_TOTAL_STUDENTS", {
        totalStudents: result,
      });

      return result;
    },

    async fetchTotalTeachers(context) {
      const querySnapshot = await getDocs(teachersCol);
      const result = querySnapshot.docs.map((doc) => ({
        grade: doc.data().grade,
        group: doc.data().group,
        name: doc.data().name,
        role: doc.data().role,
        attendance: "",
      }));

      context.commit("SET_TOTAL_TEACHERS", {
        totalTeachers: result,
      });

      return result;
    },

    // TODO: 함수명 바꿔야함
    async fetchStudentAttendancesByDate(context, payload) {
      const q = query(studentsAttendanceCol, where("date", "==", payload.date));
      const res = await getDocs(q);
      const result = res.docs.map((value) => value.data().studentsAttendance);
      return result.flat();
    },

    async fetchTeachersAttendanceByDate(context, payload) {
      const q = query(teachersAttendanceCol, where("date", "==", payload.date));
      const res = await getDocs(q);
      if (res.docs.length > 0) {
        return res.docs[0].data();
      } else {
        // ALL TEACHERS
        const q = query(teachersCol, orderBy("name"));
        const querySnapshot = await getDocs(q);
        const initTeachersAttendance = querySnapshot.docs.map((doc) => ({
          name: doc.data().name,
          attendance: "",
        }));
        const result = { result: "", teachersAttendance: [...initTeachersAttendance] };
        return result;
      }
    },

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
        // const fetchStudentsByClassResponse = await context.dispatch("fetchStudentsByClass", payload);
        // const initStudentsAttendance = fetchStudentsByClassResponse.docs.map((doc: any) => ({
        //   teacher: doc.data().teacher,
        //   grade: doc.data().grade,
        //   group: doc.data().group,
        //   name: doc.data().name,
        //   attendance: "",
        // }));

        const initStudentsAttendance = context.state.totalStudents;

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
      const q = query(teachersAttendanceCol, where("date", "==", payload.date));
      const fetchTeachersAttendanceResponse = await getDocs(q);

      if (fetchTeachersAttendanceResponse.docs.length > 0) {
        const result = {
          recordId: fetchTeachersAttendanceResponse.docs[0].id,
          ...fetchTeachersAttendanceResponse.docs[0].data(),
        };

        return result;
      } else {
        const initTeachersAttendance = context.state.totalTeachers;
        return { result: "", teachersAttendance: [...initTeachersAttendance] };
      }
    },

    async addTeachersAttendance(context, payload) {
      if (payload.recordId) {
        const docId = payload.recordId;
        delete payload.recordId;
        await setDoc(doc(db, "teachersAttendance", docId), payload);
      } else {
        delete payload.recordId;
        const result = await addDoc(studentsAttendanceCol, payload);
        return result;
      }
    },
  },
};
