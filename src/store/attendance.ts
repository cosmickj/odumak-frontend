import { defineStore } from 'pinia';

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

import { AttendanceData } from '@/types';

interface AttendaceAddAttendanceParams {
  name: string;
  church: string;
  department: string;
  grade: string;
  group: string;
  job: 'student' | 'teacher';
  attendance: 'online' | 'offline' | 'absence';
}

interface AttendaceFetchAttendancesParams {
  grade?: string;
  group?: string;
  church: string;
  department: string;
  job: 'student' | 'teacher';
}

interface AttendaceModifyAttendanceParams {
  uid: string;
  attendance: 'online' | 'offline' | 'absence';
}

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({}),
  actions: {
    // CONTINUE: 저장할 때 저장 시간 및 출석 날짜도 추가하기
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
        where('job', '==', params.job)
      );
      const qSnapshot = await getDocs(q);

      const result = qSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      return result as unknown as AttendanceData[];
    },

    async modifyAttendance(params: AttendaceModifyAttendanceParams) {
      return await updateDoc(doc(db, 'newAttendances', params.uid), {
        attendance: params.attendance,
      });
    },
  },
});
