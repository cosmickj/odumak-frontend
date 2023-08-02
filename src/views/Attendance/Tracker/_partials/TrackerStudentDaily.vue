<template>
  <p class="text-xl text-center">학생 일일 출석현황</p>

  <Calendar
    v-model="attendanceDate"
    class="mt-5"
    input-class="text-center"
    placeholder="날짜를 선택해주세요"
    :max-date="maxDate"
    :disabled-days="[1, 2, 3, 4, 5, 6]"
    @date-select="onAttendanceDateSelect"
  />

  <table class="mt-4">
    <thead>
      <tr>
        <th>학년반</th>
        <th>우리 반 친구들</th>
        <th>출석</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(key, i) in Object.keys(attendanceRecords)" :key="i">
        <td>{{ key }}</td>

        <td class="grid gap-1 xs:grid-cols-4 grid-cols-3 grid-rows-2">
          <span
            v-for="(attd, j) in attendanceRecords[key]"
            class="whitespace-nowrap text-sm text-center"
            :class="paintAttendance(attd.attendance.status)"
            :key="j"
          >
            {{ attd.name }}
          </span>
        </td>

        <td class="text-pink-500">
          {{ countAttendance(attendanceRecords[key]) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAttendanceStore } from '@/store/attendance';
import { useUserStore } from '@/store/user';
import { getPreviousSunday } from '@/utils/useCalendar';
import type { Attendance } from '@/models';
import type { Status } from '@/types';

const attendanceStore = useAttendanceStore();
const userStore = useUserStore();

const maxDate = getPreviousSunday();
const attendanceDate = ref<Date>(getPreviousSunday());

interface StudentAttendanceRecord {
  [key: string]: Attendance[];
}

const attendanceRecords = ref<StudentAttendanceRecord>({});

const getAttendanceRecords = async () => {
  try {
    const rawAttendanceRecords = await attendanceStore.fetchAttendances({
      church: userStore.userData?.church ?? '',
      department: userStore.userData?.department ?? '',
      job: 'student',
      attendanceDate: attendanceDate.value,
    });

    const cleanedAttendanceRecords = rawAttendanceRecords.reduce(
      (acc, attd) => {
        const key = `${attd.grade}-${attd.group}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(attd);
        return acc;
      },
      {} as { [key: string]: Attendance[] }
    );

    return cleanedAttendanceRecords;
  } catch (error) {
    return {};
  }
};

const countAttendance = (records: Attendance[]) => {
  return records.filter(
    (record) =>
      record.attendance.status === 'offline' ||
      record.attendance.status === 'online'
  ).length;
};

const paintAttendance = (status: Status) => {
  return status === 'offline' || status === 'online' ? 'text-sky-700' : '';
};

onMounted(async () => {
  attendanceRecords.value = await getAttendanceRecords();
});

const onAttendanceDateSelect = async () => {
  attendanceRecords.value = await getAttendanceRecords();
};
</script>

<style scoped>
table {
  overflow: auto;
  display: grid;
  grid-template-columns: minmax(60px, 1fr) 3fr minmax(50px, 1fr);
}

thead,
tbody,
tr {
  display: contents;
}

th,
td {
  display: flex;
  align-items: center;
  justify-content: center;
}

th {
  position: sticky;
  top: 0;
  padding: 10px 8px;
  background: #bae6fd; /* sky 200 */
  color: #333;
  font-weight: normal;
  text-align: center;
}

td {
  padding: 4px;
  background: #f0f9ff; /* sky 100 */
  color: #333;
}

tr:nth-child(even) td {
  background: #e0f2fe; /* sky 50 */
}
</style>
