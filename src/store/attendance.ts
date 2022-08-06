import { defineStore } from 'pinia';
import {
  attendancesColl,
  db,
  studentsAttendanceColl,
  teachersAttendanceColl,
} from '@/firebase/config';
import {
  addDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { Student } from '@/types';
import type { StudentsAttendance, TeachersAttendance } from '@/types/store';
import { fetchStudents, fetchTeachers } from '@/api/members';

interface AttendanceByDatePayload {
  date: Date;
}

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

      if (querySnapshot.docs.length) {
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
    async fetchStudentsAttendanceByDate(payload: AttendanceByDatePayload) {
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
    async fetchTeachersAttendanceByDate(payload: AttendanceByDatePayload) {
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

    // NEW LOGIC
    async fetchAttendance(payload: any) {
      const q = query(
        attendancesColl,
        where('attendanceDate', '==', payload.attendanceDate),
        where('church', '==', payload.church),
        where('department', '==', payload.department),
        where('position', '==', payload.position)
      );

      const querySnapshot = await getDocs(q);

      // 출석 기록 O
      if (querySnapshot.docs.length) {
        return {
          documentId: querySnapshot.docs[0].id,
          attendanceRecord: querySnapshot.docs[0].data().records,
        };
      }
      // 출석 기록 X
      else {
        let attendanceRecord = [];

        payload.members.forEach((member) => {
          const { grade, group, name, teacher } = member;
          attendanceRecord.push({
            grade,
            group,
            name,
            teacher,
            attendance: 'offline',
          });
        });

        return { documentId: '', attendanceRecord };
      }
    },

    async addAttendance(payload: any) {
      const { documentId, ...info } = payload;

      // 문서 수정
      if (documentId) {
        await updateDoc(doc(db, 'attendances', documentId), {
          records: info.records,
          updateUser: info.createUser,
          updatedAt: serverTimestamp(),
        });

        return { message: '수정되었습니다.', documentId };
      }
      // 문서 제출
      else {
        const params = {
          ...info,
          createdAt: serverTimestamp(),
          updateUser: info.createUser,
          updatedAt: serverTimestamp(),
        };

        const result = await addDoc(attendancesColl, params);

        return { message: '제출되었습니다.', documentId: result.id };
      }
    },
  },
});
