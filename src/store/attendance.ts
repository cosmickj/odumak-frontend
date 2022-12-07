import { defineStore } from 'pinia';
import { useMemberStore } from './member';

import { db, attendancesColl } from '@/firebase/config';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import type {
  Attendance,
  Member,
  MemberPosition,
  Teacher,
  TeacherRole,
} from '@/types';
import type {
  AttendaceAddAttendanceParams,
  AttendaceAddAttendancesParams,
  AttendaceRemoveAttendanceParams,
} from '@/types/store';

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({}),
  actions: {
    // 학생 일일 출석 확인하기
    async fetchStudentsAttendanceByDate(payload: {
      attendanceDate: Date;
      church: string;
      department: string;
    }) {
      // const q = query(
      //   attendancesColl,
      //   where('attendanceDate', '==', payload.attendanceDate),
      //   where('church', '==', payload.church),
      //   where('department', '==', payload.department)
      // );
      // const querySnapshot = await getDocs(q);
      // const attendanceList = querySnapshot.docs
      //   .map((doc) => doc.data().records)
      //   .flat();
      // const member = useMemberStore();
      // let studentList = (await member.fetchMembers({
      //   church: payload.church,
      //   department: payload.department,
      //   position: 'student',
      // })) as Student[];
      // // TODO: 알고리즘 개선 필요
      // for (const attendance of attendanceList) {
      //   for (const student of studentList) {
      //     if (student.name === attendance.name) {
      //       student.attendance = attendance.attendance;
      //       break;
      //     }
      //   }
      // }
      // return studentList;
    },

    // 교사 일일 출석 확인하기
    async fetchTeachersAttendanceByDate(payload: {
      attendanceDate: Date;
      church: string;
      department: string;
    }) {
      // const q = query(
      //   attendancesColl,
      //   where('attendanceDate', '==', payload.attendanceDate),
      //   where('church', '==', payload.church),
      //   where('department', '==', payload.department)
      // );
      // const querySnapshot = await getDocs(q);
      // const attendanceList = querySnapshot.docs
      //   .map((docs) => docs.data().records)
      //   .flat();
      // const member = useMemberStore();
      // let teahcerList = (await member.fetchMembers({
      //   church: payload.church,
      //   department: payload.department,
      //   position: 'teacher',
      // })) as Teacher[];
      // // TODO: 알고리즘 개선 필요
      // for (const attendance of attendanceList) {
      //   for (const teacher of teahcerList) {
      //     if (teacher.name === attendance.name) {
      //       teacher.attendance = attendance.attendance;
      //       break;
      //     }
      //   }
      // }
      // return teahcerList;
    },

    async fetchAttendance(payload: {
      // attendanceDate: Date | undefined;
      // church: string | undefined;
      // department: string | undefined;
      // grade?: string;
      // group?: string;
      // members: any;
      // position: MemberPosition;
      // role: TeacherRole;
    }) {
      // const {
      //   attendanceDate,
      //   church,
      //   department,
      //   grade,
      //   group,
      //   members,
      //   position,
      //   role,
      // } = payload;
      // let querySnapshot;
      // if (role === 'admin') {
      //   const q = query(
      //     attendancesColl,
      //     where('attendanceDate', '==', attendanceDate),
      //     where('church', '==', church),
      //     where('department', '==', department),
      //     where('position', '==', position)
      //   );
      //   querySnapshot = await getDocs(q);
      // } else if (role === 'main' || role === 'sub') {
      //   const q = query(
      //     attendancesColl,
      //     where('attendanceDate', '==', attendanceDate),
      //     where('church', '==', church),
      //     where('department', '==', department),
      //     where('grade', '==', grade),
      //     where('group', '==', group),
      //     where('position', '==', position)
      //   );
      //   querySnapshot = await getDocs(q);
      // } else {
      //   return;
      // }
      // /** TODO : 이 부분에서 함수 나누기 */
      // // 출석 기록 O
      // if (querySnapshot.docs.length) {
      //   return {
      //     documentId: querySnapshot.docs[0].id,
      //     attendanceRecord: querySnapshot.docs[0].data().records,
      //   };
      // }
      // // 최초 등록
      // else {
      //   /** TODO : any 타입 정리하기 */
      //   let attendanceRecord: any[] = [];
      //   if (position === 'student') {
      //     /** TODO : any 타입 정리하기 */
      //     members.forEach((member: any) => {
      //       const { grade, group, name, teacher } = member;
      //       attendanceRecord.push({
      //         grade,
      //         group,
      //         name,
      //         teacher, // here
      //         attendance: 'offline',
      //       });
      //     });
      //   } else if (position === 'teacher') {
      //     /** TODO : any 타입 정리하기 */
      //     members.forEach((member: any) => {
      //       const { grade, group, name, role } = member;
      //       attendanceRecord.push({
      //         grade,
      //         group,
      //         name,
      //         role, // here
      //         attendance: 'offline',
      //       });
      //     });
      //   }
      //   return { documentId: '', attendanceRecord };
      // }
    },

    async addAttendances(params: AttendaceAddAttendancesParams) {
      const { attendances, checksum, church, department, grade, group } =
        params;

      attendances.forEach(async (attendance, index) => {
        const _old = JSON.stringify(JSON.parse(checksum)[index]);
        const _new = JSON.stringify(attendance);

        if (attendance.targetIdx !== -1 && _old !== _new) {
          await this.removeAttendance({
            attendance: JSON.parse(_old),
            church,
            department,
            grade,
            group,
          });
        }

        await this.addAttendance({
          attendance,
          church,
          department,
          grade,
          group,
        });
      });
    },

    async addAttendance(params: AttendaceAddAttendanceParams) {
      const { attendance, church, department, grade, group } = params;

      const _: Attendance = {
        attendedAt: attendance.attendedAt,
        status: attendance.status,
        state: {
          grade,
          group,
          church,
          department,
        },
        createdAt: attendance.createdAt,
      };

      await updateDoc(doc(db, 'newMembers', attendance.uid), {
        attendances: arrayUnion(_),
      });
    },

    async removeAttendance(params: AttendaceRemoveAttendanceParams) {
      const { attendance, church, department, grade, group } = params;

      const _: Attendance = {
        attendedAt: new Date(attendance.attendedAt),
        status: attendance.status,
        state: {
          grade,
          group,
          church,
          department,
        },
        createdAt: new Date(attendance.createdAt),
      };

      await updateDoc(doc(db, 'newMembers', attendance.uid), {
        attendances: arrayRemove(_),
      });
    },
  },
});
