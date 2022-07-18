import { defineStore } from 'pinia';
import { db, studentsAttendanceCol, teachersAttendanceCol } from '@/firebase/config';
import { addDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import type { Student, Teacher } from '@/types';
import teacherList from '@/database/teacher_list.json';
import studentList from '@/database/student_list.json';

interface StudentsAttendance {
  date: Date;
  grade: string;
  group: string;
  studentsAttendance: Student[];
  teacher: string;
}

interface TeachersAttendance {
  date: Date;
  teachersAttendance: Teacher[];
}

export const useAttendanceStore = defineStore('attendance', {
  state: () => {
    return {};
  },
  actions: {
    async fetchStudentsAttendance(payload: any) {
      const q = query(
        studentsAttendanceCol,
        where('date', '==', payload.date),
        where('grade', '==', payload.grade),
        where('group', '==', payload.group)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        const result = {
          documentId: querySnapshot.docs[0].id,
          ...(querySnapshot.docs[0].data() as StudentsAttendance),
        };
        return result;
      } else {
        const studentListClone: Student[] = JSON.parse(JSON.stringify(studentList));
        const result = studentListClone.filter((student) => student.teacher === payload.teacher);
        return { documentId: '', studentsAttendance: result };
      }
    },
    async fetchTeachersAttendance(payload: any) {
      const q = query(teachersAttendanceCol, where('date', '==', payload.date));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        const result = {
          documentId: querySnapshot.docs[0].id,
          ...(querySnapshot.docs[0].data() as TeachersAttendance),
        };
        return result;
      } else {
        return { documentId: '', teachersAttendance: teacherList };
      }
    },

    // 학생 일일 출석 확인하기
    async fetchStudentsAttendanceByDate(payload: any) {
      const q = query(studentsAttendanceCol, where('date', '==', payload.date));
      const querySnapshot = await getDocs(q);
      const attendanceList = querySnapshot.docs.map((value) => value.data().studentsAttendance).flat();

      const studentListClone: Student[] = JSON.parse(
        JSON.stringify(studentList.filter((student) => student.teacher !== '테스트 계정'))
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
    // 교사 일일 출석 확인하기
    async fetchTeachersAttendanceByDate(payload: any) {
      const q = query(teachersAttendanceCol, where('date', '==', payload.date));
      const querySnapshot = await getDocs(q);
      const attendanceList = querySnapshot.docs.map((value) => value.data().teachersAttendance).flat();

      const teahcerListClone: Teacher[] = JSON.parse(
        JSON.stringify(teacherList.filter((teacher) => teacher.name !== '테스트 계정'))
      );

      // TODO: 알고리즘 개선 필요
      for (const attendance of attendanceList) {
        for (const teacher of teahcerListClone) {
          if (teacher.name === attendance.name) {
            teacher.attendance = attendance.attendance;
            break;
          }
        }
      }
      return teahcerListClone;
    },

    async addTeachersAttendance(payload: any) {
      // 수정
      if (payload.documentId) {
        const docId = payload.documentId;
        delete payload.documentId;
        await setDoc(doc(db, 'teachersAttendance', docId), payload);
        return { id: docId };
      }
      // 제출
      else {
        delete payload.documentId;
        const result = await addDoc(teachersAttendanceCol, payload);
        return result;
      }
    },
  },
});
