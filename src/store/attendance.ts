import { defineStore } from 'pinia';
import {
  db,
  membersCol,
  studentsAttendanceCol,
  teachersAttendanceCol,
} from '@/firebase/config';
import { addDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import type { Student, Teacher } from '@/types';

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

interface Members {
  church: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  department: string;
  members: Teacher[] | Student[];
  position: string;
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
        const studentListClone = (await this.fetchStudentList()).members as Student[];
        const result = studentListClone.filter(
          (student) => student.teacher === payload.teacher
        );
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
        const teachers = (await this.fetchTeacherList()).members as Teacher[];
        return { documentId: '', teachersAttendance: teachers };
      }
    },

    async fetchStudentList() {
      const q = query(
        membersCol,
        where('church', '==', '영은교회'),
        where('department', '==', '초등부'),
        where('position', '==', 'student')
      );
      const querySnapshot = await getDocs(q);

      const members = querySnapshot.docs[0].data() as Members;
      return {
        documentId: querySnapshot.docs[0].id,
        ...members,
      };
    },

    async fetchTeacherList() {
      const q = query(
        membersCol,
        where('church', '==', '영은교회'),
        where('department', '==', '초등부'),
        where('position', '==', 'teacher')
      );
      const querySnapshot = await getDocs(q);
      const members = querySnapshot.docs[0].data() as Members;
      return members;
    },

    // 학생 일일 출석 확인하기
    async fetchStudentsAttendanceByDate(payload: any) {
      const q = query(studentsAttendanceCol, where('date', '==', payload.date));
      const querySnapshot = await getDocs(q);
      const attendanceList = querySnapshot.docs
        .map((value) => value.data().studentsAttendance)
        .flat();

      const studentListClone = (await this.fetchStudentList()).members as Student[];

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
      const attendanceList = querySnapshot.docs
        .map((value) => value.data().teachersAttendance)
        .flat();

      const teahcerListClone = (await this.fetchTeacherList()).members as Teacher[];

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
