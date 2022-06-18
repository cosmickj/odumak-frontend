import { Module } from "vuex";
import { db, studentsAttendanceCol, teachersAttendanceCol } from "@/firebase/config";
import { addDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { Student } from "@/types";
import { RootState, AttendanceState } from "@/store/types";
import teacherList from "@/data/teacher_list.json";
import studentList from "@/data/student_list.json";

export const attendance: Module<AttendanceState, RootState> = {
  namespaced: true,

  state: () => ({}),

  mutations: {},

  actions: {
    // async fetchTeachersAttendanceByDate(context, payload) {
    //   const q = query(teachersAttendanceCol, where("date", "==", payload.date));
    //   const res = await getDocs(q);
    //   if (res.docs.length > 0) {
    //     return res.docs[0].data();
    //   } else {
    //     // ALL TEACHERS
    //     const q = query(teachersCol, orderBy("name"));
    //     const querySnapshot = await getDocs(q);
    //     const initTeachersAttendance = querySnapshot.docs.map((doc) => ({
    //       name: doc.data().name,
    //       attendance: "",
    //     }));
    //     const result = { result: "", teachersAttendance: [...initTeachersAttendance] };
    //     return result;
    //   }
    // },

    /** ABOUT TEACHERS */
    async fetchTeachersAttendance(context, payload) {
      const q = query(teachersAttendanceCol, where("date", "==", payload.date));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        const result = {
          recordId: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        };
        return result;
      } else {
        return { recordId: "", teachersAttendance: teacherList };
      }
    },
    async addTeachersAttendance(context, payload) {
      // 수정
      if (payload.recordId) {
        const docId = payload.recordId;
        delete payload.recordId;
        await setDoc(doc(db, "teachersAttendance", docId), payload);
        return { id: docId };
      }
      // 제출
      else {
        delete payload.recordId;
        const result = await addDoc(teachersAttendanceCol, payload);
        return result;
      }
    },

    /** ABOUT STUDENTS */
    async fetchStudentsAttendance(context, payload) {
      const q = query(
        studentsAttendanceCol,
        where("date", "==", payload.date),
        where("grade", "==", payload.grade),
        where("group", "==", payload.group)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        return {
          recordId: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        };
      } else {
        const result = studentList.filter((student) => student.teacher === payload.teacher);
        return { recordId: "", studentsAttendance: result };
      }
    },
    async fetchStudentsAttendanceByDate(context, payload) {
      const q = query(studentsAttendanceCol, where("date", "==", payload.date));
      const querySnapshot = await getDocs(q);
      const attendanceList = querySnapshot.docs.map((value) => value.data().studentsAttendance).flat();

      const studentListTemplate = JSON.parse(
        JSON.stringify(studentList.filter((student) => student.teacher !== "테스트 계정"))
      );
      // TODO: 알고리즘 개선 필요
      for (const attendance of attendanceList) {
        for (const student of studentListTemplate as Student[]) {
          if (student.name === attendance.name) {
            student.attendance = attendance.attendance;
            break;
          }
        }
      }
      return studentListTemplate;
    },
    async addStudentsAttendance(context, payload) {
      // 수정
      if (payload.recordId) {
        const docId = payload.recordId;
        delete payload.recordId;
        await setDoc(doc(db, "studentsAttendance", docId), payload);
        return { id: docId };
      }
      // 제출
      else {
        delete payload.recordId;
        const result = await addDoc(studentsAttendanceCol, payload);
        return result;
      }
    },
  },
};
