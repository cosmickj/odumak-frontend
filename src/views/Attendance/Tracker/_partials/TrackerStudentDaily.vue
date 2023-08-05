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

  <div class="mt-4 text-center">
    <SelectButton
      unselectable
      v-model="selectedOption"
      option-label="label"
      option-value="value"
      :options="options"
    />
  </div>

  <table v-if="selectedOption === 'all'" class="mt-6">
    <thead>
      <tr>
        <th>학년반</th>
        <th>우리 반 친구들</th>
        <th>출석</th>
      </tr>
    </thead>

    <tbody v-if="isReady">
      <tr v-for="i in 10" :key="i">
        <td class="p-2"><Skeleton /></td>
        <td class="p-2"><Skeleton /></td>
        <td class="p-2"><Skeleton /></td>
      </tr>
    </tbody>

    <tbody v-else>
      <tr v-for="(key, i) in Object.keys(attdRecordsForTable)" :key="i">
        <td>{{ key }}</td>

        <td class="grid gap-1 xs:grid-cols-4 grid-cols-3 grid-rows-2">
          <span
            v-for="(attd, j) in attdRecordsForTable[key]"
            class="whitespace-nowrap text-sm text-center"
            :class="paintAttendance(attd.attendance.status)"
            :key="j"
          >
            {{ attd.name }}
          </span>
        </td>

        <td class="text-pink-500">
          {{ countAttendance(attdRecordsForTable[key]) }}
        </td>
      </tr>
    </tbody>
  </table>

  <div v-else-if="selectedOption === 'chart'" class="mt-6">
    <Chart
      type="bar"
      :height="250"
      :data="attdRecordsForChart"
      :options="chartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAttendanceStore } from '@/store/attendance';
import { useUserStore } from '@/store/user';
import { getPreviousSunday } from '@/utils/useCalendar';
import type { Attendance } from '@/models';
import type { Status } from '@/types';

const attendanceStore = useAttendanceStore();
const userStore = useUserStore();

const maxDate = getPreviousSunday();
const attendanceDate = ref<Date>(getPreviousSunday());

const options = [
  { label: '전체 보기', value: 'all' },
  { label: '차트 보기', value: 'chart' },
  { label: '개별 보기', value: 'detail' },
];
const selectedOption = ref(options[1].value);

interface StudentAttendanceRecord {
  [key: string]: Attendance[];
}

const isReady = computed(() => !Object.keys(attdRecordsForTable.value).length);

const rawAttdRecords = ref<Attendance[]>([]);
const attdRecordsForTable = ref<StudentAttendanceRecord>({});
const attdRecordsForChart = ref();

const getAttendanceRecords = async () => {
  try {
    return await attendanceStore.fetchAttendances({
      church: userStore.userData?.church ?? '',
      department: userStore.userData?.department ?? '',
      job: 'student',
      attendanceDate: attendanceDate.value,
    });
  } catch (error) {
    return [];
  }
};

const convertAttdRecordsForTable = (attdRecords: Attendance[]) => {
  return attdRecords.reduce((acc, attd) => {
    const key = `${attd.grade}-${attd.group}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(attd);
    return acc;
  }, {} as { [key: string]: Attendance[] });
};

const convertAttdRecordsForChart = (attdRecords: Attendance[]) => {
  const rawData = attdRecords.reduce(
    (total, record) => {
      const status = record.attendance.status
        ? record.attendance.status
        : 'empty';
      const currCount = total[status] ?? 0;

      return { ...total, [status]: currCount + 1 };
    },
    { offline: 0, online: 0, absence: 0, empty: 0 }
  );

  return {
    labels: ['현장', '온라인', '결석', '미입력'],
    datasets: [
      {
        label: '출석 현황',
        data: Object.values(rawData),
        backgroundColor: [
          'rgba(76, 175, 80, 0.2)',
          'rgba(251, 192, 45, 0.2)',
          'rgba(255, 64, 50, 0.2)',
          'rgba(158, 158, 158, 0.2)',
        ],
        borderColor: [
          'rgb(76, 175, 80)',
          'rgb(251, 192, 45)',
          'rgb(255, 64, 50)',
          'rgb(158, 158, 158)',
        ],
        borderWidth: 1,
        borderRadius: 3,
      },
    ],
  };
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

const chartOptions = {
  plugins: {
    datalabels: {
      display: true,
      anchor: 'end',
      align: 'center',
      font: {
        size: 20,
      },
      color: '#333',
    },
    tooltip: {
      enabled: true,
    },
    legend: {
      display: false,
    },
  },
};

onMounted(async () => {
  rawAttdRecords.value = await getAttendanceRecords();
  attdRecordsForTable.value = convertAttdRecordsForTable(rawAttdRecords.value);
  attdRecordsForChart.value = convertAttdRecordsForChart(rawAttdRecords.value);
});

const onAttendanceDateSelect = async () => {
  rawAttdRecords.value = await getAttendanceRecords();
  attdRecordsForTable.value = convertAttdRecordsForTable(rawAttdRecords.value);
  attdRecordsForChart.value = convertAttdRecordsForChart(rawAttdRecords.value);
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

:deep(.p-selectbutton) .p-button {
  padding: 4px 8px;
}
:deep(.p-selectbutton) .p-button:first-of-type {
  border-radius: 999px 0 0 999px;
}
:deep(.p-selectbutton) .p-button:last-of-type {
  border-radius: 0 999px 999px 0;
}
</style>
