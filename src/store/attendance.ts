import { db, attendancesColl } from '@/firebase/config';
import {
  addDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { useMemberStore } from './member';
import { AttendanceData } from '@/types';

interface AttendaceAddAttendanceParams {
  name: string;
  church: string;
  department: string;
  grade: string;
  group: string;
  job: 'student' | 'teacher';
  attendance: {
    date: Date;
    status: 'online' | 'offline' | 'absence';
  };
  createdBy: string;
}

interface AttendaceFetchAttendancesParams {
  grade?: string;
  group?: string;
  church: string;
  department: string;
  job: 'student' | 'teacher';
  attendanceDate: Date;
}

interface AttendaceModifyAttendanceParams {
  uid: string;
  attendance: {
    status: 'online' | 'offline' | 'absence';
  };
}

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    attendancesRecord: {
      daily: [] as AttendanceData[],
    },
  }),
  actions: {
    async addAttendance(params: AttendaceAddAttendanceParams) {
      return await addDoc(attendancesColl, {
        ...params,
        createdAt: serverTimestamp(),
      });
    },

    async fetchAttendances(params: AttendaceFetchAttendancesParams) {
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

      const attendanceData = qSnapshot.docs.map((doc) => doc.data());

      const attendances: AttendanceData[] = members.map((member) => {
        const memberAttendance = attendanceData.find((attendance) => {
          return (
            attendance.name === member.name &&
            attendance.church === member.church &&
            attendance.department === member.department &&
            attendance.job === member.job
          );
        });

        return {
          uid: member.uid || '',
          name: member.name,
          church: member.church,
          department: member.department,
          grade: member.grade,
          group: member.group,
          job: member.job,
          attendance: memberAttendance?.attendance || {
            status: '',
            date: null,
          },
        };
      });

      this.attendancesRecord.daily = attendances;
    },

    async modifyAttendance(params: AttendaceModifyAttendanceParams) {
      return await updateDoc(doc(db, 'newAttendances', params.uid), {
        'attendance.status': params.attendance.status,
      });
    },
  },
});
