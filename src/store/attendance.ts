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
import { defineStore } from 'pinia';
import { useMemberStore } from './member';
import type { AttendanceData } from '@/types';
import type {
  AddAttendanceParams,
  FetchAttendancesParams,
  ModifyAttendanceParams,
} from '@/types/store';

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    attendancesRecord: {
      daily: [] as AttendanceData[],
    },
  }),
  actions: {
    async addAttendance(params: AddAttendanceParams) {
      return await addDoc(attendancesColl, {
        ...params,
        createdAt: serverTimestamp(),
      });
    },

    async fetchAttendances(params: FetchAttendancesParams) {
      this.attendancesRecord.daily = [];

      const memberStore = useMemberStore();
      const members = await memberStore.fetchAll({
        church: params.church,
        department: params.department,
        job: params.job,
      });

      const q = query(
        attendancesColl,
        where('church', '==', params.church),
        where('department', '==', params.department),
        where('job', '==', params.job),
        where('attendance.date', '==', params.attendanceDate)
      );
      const qSnapshot = await getDocs(q);

      const attendanceData = qSnapshot.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id } as any;
      });

      const attendances: AttendanceData[] = members
        .filter((member) => member.registeredAt <= params.attendanceDate)
        .map((member) => {
          const memberAttendance = attendanceData.find((attendance) => {
            return (
              attendance.name === member.name &&
              attendance.church === member.church &&
              attendance.department === member.department &&
              attendance.job === member.job
            );
          });
          const attendance = { status: '', date: null };

          return {
            uid: memberAttendance?.uid || '',
            name: member.name,
            church: member.church,
            department: member.department,
            grade: member.grade,
            group: member.group,
            job: member.job,
            role: member.role,
            attendance: memberAttendance?.attendance || attendance,
          };
        });

      this.attendancesRecord.daily = attendances;
    },

    async modifyAttendance(params: ModifyAttendanceParams) {
      return await updateDoc(doc(db, 'attendances', params.uid), {
        'attendance.status': params.attendance.status,
      });
    },
  },
});
