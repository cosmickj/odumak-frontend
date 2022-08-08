import { defineStore } from 'pinia';
import { useMemberStore } from './member';
import { db, attendancesColl } from '@/firebase/config';
import {
  addDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { MemberPosition, Student, Teacher, TeacherRole } from '@/types';

export const useAttendanceStore = defineStore('attendance', {
  state: () => {
    return {};
  },
  actions: {
    // 학생 일일 출석 확인하기
    async fetchStudentsAttendanceByDate(payload: {
      attendanceDate: Date;
      church: string;
      department: string;
    }) {
      const q = query(
        attendancesColl,
        where('attendanceDate', '==', payload.attendanceDate),
        where('church', '==', payload.church),
        where('department', '==', payload.department)
      );

      const querySnapshot = await getDocs(q);

      const attendanceList = querySnapshot.docs
        .map((doc) => doc.data().records)
        .flat();

      const member = useMemberStore();
      let studentList = (await member.fetchMembers({
        church: payload.church,
        department: payload.department,
        position: 'student',
      })) as Student[];

      // TODO: 알고리즘 개선 필요
      for (const attendance of attendanceList) {
        for (const student of studentList) {
          if (student.name === attendance.name) {
            student.attendance = attendance.attendance;
            break;
          }
        }
      }
      return studentList;
    },

    // 교사 일일 출석 확인하기
    async fetchTeachersAttendanceByDate(payload: {
      attendanceDate: Date;
      church: string;
      department: string;
    }) {
      const q = query(
        attendancesColl,
        where('attendanceDate', '==', payload.attendanceDate),
        where('church', '==', payload.church),
        where('department', '==', payload.department)
      );

      const querySnapshot = await getDocs(q);

      const attendanceList = querySnapshot.docs
        .map((docs) => docs.data().records)
        .flat();

      const member = useMemberStore();
      let teahcerList = (await member.fetchMembers({
        church: payload.church,
        department: payload.department,
        position: 'teacher',
      })) as Teacher[];

      // TODO: 알고리즘 개선 필요
      for (const attendance of attendanceList) {
        for (const teacher of teahcerList) {
          if (teacher.name === attendance.name) {
            teacher.attendance = attendance.attendance;
            break;
          }
        }
      }
      return teahcerList;
    },

    async fetchAttendance(payload: {
      attendanceDate: Date | undefined;
      church: string | undefined;
      department: string | undefined;
      grade?: string;
      group?: string;
      members: any;
      position: MemberPosition;
      role: TeacherRole;
    }) {
      const {
        attendanceDate,
        church,
        department,
        grade,
        group,
        members,
        position,
        role,
      } = payload;

      let querySnapshot;
      if (role === 'admin') {
        const q = query(
          attendancesColl,
          where('attendanceDate', '==', attendanceDate),
          where('church', '==', church),
          where('department', '==', department),
          where('position', '==', position)
        );
        querySnapshot = await getDocs(q);
      }
      // role === 'teacher'
      else {
        const q = query(
          attendancesColl,
          where('attendanceDate', '==', attendanceDate),
          where('church', '==', church),
          where('department', '==', department),
          where('grade', '==', grade),
          where('group', '==', group),
          where('position', '==', position)
        );
        querySnapshot = await getDocs(q);
      }

      /** TODO : 이 부분에서 함수 나누기 */
      // 출석 기록 O
      if (querySnapshot.docs.length) {
        return {
          documentId: querySnapshot.docs[0].id,
          attendanceRecord: querySnapshot.docs[0].data().records,
        };
      }
      // 최초 등록
      else {
        /** TODO : any 타입 정리하기 */
        let attendanceRecord: any[] = [];
        if (position === 'student') {
          /** TODO : any 타입 정리하기 */
          members.forEach((member: any) => {
            const { grade, group, name, teacher } = member;
            attendanceRecord.push({
              grade,
              group,
              name,
              teacher,
              attendance: 'offline',
            });
          });
        } else if (position === 'teacher') {
          /** TODO : any 타입 정리하기 */
          members.forEach((member: any) => {
            const { grade, group, name, role } = member;
            attendanceRecord.push({
              grade,
              group,
              name,
              role,
              attendance: 'offline',
            });
          });
        }
        return { documentId: '', attendanceRecord };
      }
    },

    async addAttendance(payload: {
      documentId: string;
      attendanceDate: Date | undefined;
      createUser: string | undefined;
      church: string | undefined;
      department: string | undefined;
      grade?: string | undefined;
      group?: string | undefined;
      position: MemberPosition;
      records: any;
    }) {
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
