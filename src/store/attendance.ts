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
import { Attendance } from '@/models';
import { COLLECTION } from '@/constants/common';
import { attendanceConverter } from '@/utils/useConverter';
import type {
  AddAttendanceParams,
  FetchAttendancesParams,
  ModifyAttendanceParams,
} from '@/types/store';

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    attendancesRecord: {
      daily: [] as Attendance[],
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
      const { attendanceDate, church, department, job } = params;

      const memberStore = useMemberStore();
      const members = await memberStore.fetchAll({ job, church, department });

      const attendanceQuery = query(
        attendancesColl,
        where('church', '==', church),
        where('department', '==', department),
        where('job', '==', job),
        where('attendance.date', '==', attendanceDate)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);

      const registeredAttendances = attendanceSnapshot.docs.map((doc) => ({
        ...attendanceConverter.fromFirestore(doc),
        uid: doc.id,
      }));

      const attendances = members
        .filter((mem) => {
          mem.registeredAt.setHours(0, 0, 0);
          attendanceDate.setHours(0, 0, 0);

          return mem.registeredAt <= attendanceDate && !mem.role.officer;
        })
        .map((mem) => {
          const attendanceTemp = { date: attendanceDate, status: null };

          const registeredAttendance = registeredAttendances.find((attd) => {
            return (
              attd.name === mem.name &&
              attd.church === mem.church &&
              attd.department === mem.department &&
              attd.grade === mem.grade &&
              attd.group === mem.group &&
              attd.job === mem.job
            );
          });

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

      return attendances;
    },

    async fetchAttendancesByGradeGroup(p: Required<FetchAttendancesParams>) {
      const { attendanceDate, church, department, grade, group, job } = p;

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

      const registeredAttendances = attendanceSnapshot.docs.map((doc) => ({
        ...attendanceConverter.fromFirestore(doc),
        uid: doc.id,
      }));

      const attendances = members
        .filter((mem) => {
          mem.registeredAt.setHours(0, 0, 0);
          attendanceDate.setHours(0, 0, 0);

          return mem.registeredAt <= attendanceDate && !mem.role.officer;
        })
        .map((mem) => {
          const attendanceTemp = { date: attendanceDate, status: null };

          const registeredAttendance = registeredAttendances.find((attd) => {
            return (
              mem.name == attd.name &&
              mem.church == attd.church &&
              mem.department == attd.department &&
              attd.grade === mem.grade &&
              attd.group === mem.group &&
              attd.job === mem.job
            );
          });

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

      return attendances;
    },

    async modifyAttendance(params: ModifyAttendanceParams) {
      return await updateDoc(doc(db, COLLECTION.ATTENDANCES, params.uid), {
        'attendance.status': params.attendance.status,
      });
    },
  },
});
