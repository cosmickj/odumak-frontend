import { defineStore } from 'pinia';

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
      const q = query(
        attendancesColl,
        where('church', '==', params.church),
        where('department', '==', params.department),
        where('job', '==', params.job),
        where('attendance.date', '==', params.attendanceDate)
      );
      const qSnapshot = await getDocs(q);

      const result: AttendanceData[] = qSnapshot.docs.map((doc) => ({
        uid: doc.id,
        name: doc.data().name,
        church: doc.data().church,
        department: doc.data().department,
        job: doc.data().job,
        grade: doc.data().grade,
        group: doc.data().group,
        attendance: {
          date: (doc.data().attendance.date as Timestamp).toDate(),
          status: doc.data().attendance.status,
        },
        createdAt: (doc.data().createdAt as Timestamp).toDate(),
        createdBy: doc.data().createdBy,
      }));

      this.attendancesRecord.daily = result;
    },

    async modifyAttendance(params: AttendaceModifyAttendanceParams) {
      return await updateDoc(doc(db, 'newAttendances', params.uid), {
        'attendance.status': params.attendance.status,
      });
    },
  },
});
