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

import type { Attendance, MemberData, UserRole } from '@/types';
import type {
  AttendaceAddAttendanceParams,
  AttendaceAddAttendancesParams,
  AttendaceRemoveAttendanceParams,
} from '@/types/store';

interface AttendaceFetchAttendancesParams {
  grade?: string;
  group?: string;
  church: string;
  department: string;
  job: 'student' | 'teacher';
}

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({}),
  actions: {
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

    async fetchAttendances(params: AttendaceFetchAttendancesParams) {
      const q = query(
        attendancesColl,
        where('church', '==', params.church),
        where('department', '==', params.department),
        where('job', '==', params.job)
      );
      const qSnapshot = await getDocs(q);

      return qSnapshot.docs.map((doc) => doc);
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
