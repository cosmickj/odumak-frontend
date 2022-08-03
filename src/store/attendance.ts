import { defineStore } from 'pinia';
import { db, studentsAttendanceColl, teachersAttendanceColl } from '@/firebase/config';
import { addDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import type { Student } from '@/types';
import type { StudentsAttendance, TeachersAttendance } from '@/types/store';
import { fetchStudents, fetchTeachers } from '@/api/members';

export const useAttendanceStore = defineStore('attendance', {
  state: () => {
    return {};
  },
  actions: {
    async fetchStudentsAttendance(payload: any) {
      const q = query(
        studentsAttendanceColl,
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
        const result = await fetchStudents();
        let studentListClone = result.data;
        studentListClone = studentListClone.filter(
          (student: Student) => student.teacher === payload.teacher
        );
        return { documentId: '', studentsAttendance: studentListClone };
      }
    },

    async fetchTeachersAttendance(payload: any) {
      const q = query(teachersAttendanceColl, where('date', '==', payload.date));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        const result = {
          documentId: querySnapshot.docs[0].id,
          ...(querySnapshot.docs[0].data() as TeachersAttendance),
        };
        return result;
      } else {
        const result = await fetchTeachers();
        return { documentId: '', teachersAttendance: result.data };
      }
    },

    // 학생 일일 출석 확인하기
    async fetchStudentsAttendanceByDate(payload: any) {
      const q = query(studentsAttendanceColl, where('date', '==', payload.date));
      const querySnapshot = await getDocs(q);
      const attendanceList = querySnapshot.docs
        .map((value) => value.data().studentsAttendance)
        .flat();

      const result = await fetchStudents();
      const studentListClone = result.data;

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
      const q = query(teachersAttendanceColl, where('date', '==', payload.date));
      const querySnapshot = await getDocs(q);
      const attendanceList = querySnapshot.docs
        .map((value) => value.data().teachersAttendance)
        .flat();

      const result = await fetchTeachers();
      const teahcerListClone = result.data;

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
        const result = await addDoc(teachersAttendanceColl, payload);
        return result;
      }
    },
  },
});
