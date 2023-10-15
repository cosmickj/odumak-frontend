import arraySort from 'array-sort';
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

    /**
     * @description 학생 일일 출석현황, 관리자 출석 입력
     */
    async fetchAttendances(params: FetchAttendancesParams) {
      const { attendanceDate, church, department, job } = params;

      const memberStore = useMemberStore();

      // 해당하는 교회와 부서의 모든 멤버를 읽어온다.
      const members = await memberStore.fetchAll({ job, church, department });

      // 해당 날짜에 교회와 부서를 기준으로 기입력된 출석 데이터를 읽어온다.
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

      // 읽어온 모든 맴버와 기입력된 출석 데이터를 대조하여 최종 출석 데이터를 가공한다.
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
            status: mem.status,
            attendance: registeredAttendance?.attendance || attendanceTemp,
          };
        });

      // FIXME:
      const memberNames = members.map(({ name }) => name);
      const needToAdd = registeredAttendances.filter(({ name }) => {
        return !memberNames.includes(name);
      });

      const result = [...attendances, ...needToAdd];
      return arraySort(result, ['grade', 'group', 'name']);
    },

    /**
     * @description 담임/부담임이 출석을 입력할 때 사용
     */
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
            status: mem.status,
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
