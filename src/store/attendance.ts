import { Module } from "vuex";
import { db, attendancesCol, studentsCol } from "@/firebase/config";
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
      const q = query(attendancesCol, where("date", "==", payload.date));
      const res = await getDocs(q);
      const result = res.docs.map((value) => value.data().studentAttendances);
      return result.flat();
    },

    async fetchTeacherAttendancesByDate(context, payload) {
      const q = query(attendancesCol, where("date", "==", payload.date));
      const res = await getDocs(q);
      const result = res.docs.map((value) => ({
        grade: value.data().grade,
        group: value.data().group,
        name: value.data().teacher,
        attendance: value.data().teacherAttendance,
      }));
      return result;
    },

    async fetchAttendances(context, payload) {
      const q = query(
        attendancesCol,
        where("date", "==", payload.date),
        where("grade", "==", payload.grade),
        where("group", "==", payload.group)
      );
      const fetchAttendancesResponse = await getDocs(q);

      // 입력된 출석현황 있음
      if (fetchAttendancesResponse.docs.length > 0) {
        context.commit("SET_TEACHER_ATTENDANCE", fetchAttendancesResponse.docs[0].data().teacherAttendance);
        const fetchAttendancesResult = {
          recordId: fetchAttendancesResponse.docs[0].id,
          ...fetchAttendancesResponse.docs[0].data(),
        };
        return fetchAttendancesResult;
      }
      // 입력된 출석현황 없음
      else {
        const fetchStudentsByClassResponse = await context.dispatch("fetchStudentsByClass", payload);

        // 템플릿 만들어주기
        const initAttendances = fetchStudentsByClassResponse.docs.map((doc: any) => ({
          teacher: doc.data().teacher,
          grade: doc.data().grade,
          group: doc.data().group,
          name: doc.data().name,
          attendance: "",
        }));
        const fetchAttendancesResult = {
          recordId: "",
          teacherAttendance: "online",
          studentAttendances: [...initAttendances],
        };
        return fetchAttendancesResult;
      }
    },

    async fetchStudentsByClass(context, payload) {
      const q = query(studentsCol, where("grade", "==", payload.grade), where("group", "==", payload.group));
      const fetchStudentsByClassResponse = await getDocs(q);
      return fetchStudentsByClassResponse;
    },

    async addAttendance(context, payload) {
      if (payload.recordId) {
        const docId = payload.recordId;
        delete payload.recordId;
        await setDoc(doc(db, "attendances", docId), payload);
      } else {
        delete payload.recordId;
        const result = await addDoc(attendancesCol, payload);
        return result;
      }
    },
  },
};
