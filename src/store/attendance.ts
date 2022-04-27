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

    async fetchAttendances(context, payload) {
      const q = query(
        attendancesCol,
        where("date", "==", payload.date),
        where("grade", "==", payload.grade),
        where("group", "==", payload.group)
      );
      const fetchAttendancesResponse = await getDocs(q);

      // 입력된 출석현황이 있어서 그 결과를 붙여줌
      if (fetchAttendancesResponse.docs.length > 0) {
        context.commit("SET_TEACHER_ATTENDANCE", fetchAttendancesResponse.docs[0].data().teacherAttendance);
        const fetchAttendancesResult = {
          recordId: fetchAttendancesResponse.docs[0].id,
          ...fetchAttendancesResponse.docs[0].data(),
        };
        return fetchAttendancesResult;
      }
      // 입력된 출석현황이 없기에 그 결과를 담아줄 템플릿을 건네줌
      else {
        const fetchStudentsByClassResponse = await context.dispatch("fetchStudentsByClass", payload);

        // 템플릿 만들어주기
        const initAttendances = fetchStudentsByClassResponse.docs.map((doc) => ({
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
  },
};

// const sortByName = (assignedStudents: Student[]) => {
//   assignedStudents.sort((a, b) =>
//     a.name > b.name ? 1 : b.name > a.name ? -1 : 0
//   );
//   return assignedStudents;
// };
