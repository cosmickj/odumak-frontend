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
    // 학생 출석 입력
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
        const studentListClone: Student[] = JSON.parse(JSON.stringify(studentList));
        const result = studentListClone.filter((student) => student.teacher === payload.teacher);
        return { recordId: "", studentsAttendance: result };
      }
    },
    // 학생 일일 출석 현황
    async fetchStudentsAttendanceByDate(context, payload) {
      const q = query(studentsAttendanceCol, where("date", "==", payload.date));
      const querySnapshot = await getDocs(q);
      const attendanceList = querySnapshot.docs.map((value) => value.data().studentsAttendance).flat();

      const studentListClone: Student[] = JSON.parse(
        JSON.stringify(studentList.filter((student) => student.teacher !== "테스트 계정"))
      );
      // TODO: 알고리즘 개선 필요
      for (const attendance of attendanceList) {
        for (const student of studentListClone) {
          if (student.name === attendance.name) {
            student.attendance = attendance.attendance;
            break;
          }
        }
      }
      return studentListClone;
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
        const ret = await addDoc(studentsAttendanceCol, payload);
        return ret;
      }
    },
  },
};
