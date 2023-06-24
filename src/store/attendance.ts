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
import type { AttendanceData, MemberData } from '@/types';
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
      const memberStore = useMemberStore();
      const members = await memberStore.fetchAll({
        church: params.church,
        department: params.department,
        job: params.job,
      });

      const attendanceQuery = query(
        attendancesColl,
        where('church', '==', params.church),
        where('department', '==', params.department),
        where('job', '==', params.job),
        where('attendance.date', '==', params.attendanceDate)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);

      const registeredAttendances = attendanceSnapshot.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id } as any;
      });

      const attendances: AttendanceData[] = members
        .filter((mem) => {
          return mem.registeredAt <= params.attendanceDate && !mem.role.officer;
        })
        .map((mem) => {
          const registeredAttendance = registeredAttendances.find((attd) => {
            return (
              attd.job === mem.job &&
              attd.name === mem.name &&
              attd.church === mem.church &&
              attd.department === mem.department
            );
          });
          const attendanceTemp = { status: null, date: null };

          return {
            uid: registeredAttendance?.uid || '',
            memberUid: mem.uid || '',
            name: mem.name,
            church: mem.church,
            department: mem.department,
            grade: mem.grade,
            group: mem.group,
            role: mem.role,
            job: mem.job,
            attendance: registeredAttendance?.attendance || attendanceTemp,
          };
        });

      this.attendancesRecord.daily = [];
      this.attendancesRecord.daily = attendances;
    },

    async fetchAttendancesByGradeGroup(
      params: Required<FetchAttendancesParams>
    ) {
      const { attendanceDate, church, department, grade, group, job } = params;

      const memberStore = useMemberStore();
      const members = await memberStore.fetchByGradeGroup({
        church,
        department,
        grade,
        group,
        job,
      });

      const whereGrade = grade !== '0' ? [where('grade', '==', grade)] : [];

      const attendanceQuery = query(
        attendancesColl,
        where('attendance.date', '==', attendanceDate),
        where('church', '==', church),
        where('department', '==', department),
        ...whereGrade,
        where('group', '==', group),
        where('job', '==', job)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);

      const registeredAttendances = attendanceSnapshot.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id } as any;
      });

      const attendancesRecord: AttendanceData[] = members
        .filter((mem) => mem.registeredAt <= attendanceDate)
        .map((mem) => {
          const registeredAttendance = registeredAttendances.find((attd) => {
            return (
              mem.job == attd.job &&
              mem.name == attd.name &&
              mem.church == attd.church &&
              mem.department == attd.department
            );
          });
          const attendanceTemp = { status: null, date: null };

          return {
            uid: registeredAttendance?.uid || '',
            memberUid: mem.uid || '',
            name: mem.name,
            church: mem.church,
            department: mem.department,
            grade: mem.grade,
            group: mem.group,
            role: mem.role,
            job: mem.job,
            attendance: registeredAttendance?.attendance || attendanceTemp,
          };
        });

      this.attendancesRecord.daily = [];
      this.attendancesRecord.daily = attendancesRecord;
    },

    async modifyAttendance(params: ModifyAttendanceParams) {
      return await updateDoc(doc(db, 'attendances', params.uid), {
        'attendance.status': params.attendance.status,
      });
    },
  },
});
