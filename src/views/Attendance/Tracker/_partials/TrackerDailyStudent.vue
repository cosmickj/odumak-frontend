<template>
  <section class="flex h-full flex-col overflow-auto">
    <AppHeader header="학생 일일 출석현황" route-name="HomeView" />

    <div class="flex gap-2 px-6 py-4">
      <Button rounded class="p-button-blue" icon="pi pi-chevron-left" @click="changeDate('prev')" />

      <DatePicker
        v-model="attendanceDate"
        locale="ko"
        :popover="popover"
        :masks="masks"
        :disabled-dates="disabledDates"
        :max-date="maxDate"
        @update:modelValue="onAttendanceDateSelect"
      >
        <template #default="{ inputValue, inputEvents }">
          <div class="relative flex-1">
            <InputText class="w-full" v-on="inputEvents" :value="inputValue" />
          </div>
        </template>

        <template #footer>
          <div class="w-full px-3 pb-3">
            <button
              class="w-full rounded-md bg-blue-600 px-3 py-1 font-bold text-white"
              @click="setPreviousSunday"
            >
              최근 주일로 이동하기
            </button>
          </div>
        </template>
      </DatePicker>

      <Button
        rounded
        class="p-button-blue"
        icon="pi pi-chevron-right"
        :disabled="maxDate.toString() === attendanceDate.toString()"
        @click="changeDate('next')"
      />
    </div>

    <div class="px-6 pb-4 text-center">
      <SelectButton
        v-model="selectedOption"
        option-label="label"
        option-value="value"
        :options="options"
        :unselectable="false"
      />
    </div>

    <div v-if="selectedOption === 'all'" class="px-6">
      <!-- <p class=""><sup>*</sup> 각 학년반을 클릭해보세요</p> -->
      <table>
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
            <template v-if="key.endsWith('T')">
              <td class="col-span-3 bg-blue-300 px-4 py-2">
                {{ formatTotal(key) }}
              </td>
            </template>

            <template v-else>
              <td>
                <p class="min-w-[36px]">{{ formatGrade(key) }}</p>
                <p class="min-w-[36px]">{{ formatGroup(key) }}</p>
              </td>

              <td class="grid grid-cols-3 grid-rows-2 gap-1 sm:grid-cols-4">
                <span
                  v-for="(attd, j) in attdRecordsForTable[key]"
                  class="whitespace-nowrap text-center"
                  :class="paintAttendance(attd.attendance.status)"
                  :key="j"
                >
                  {{ attd.name }}
                </span>
              </td>

              <td class="text-center">
                <span v-if="isChecked(attdRecordsForTable[key])" class="text-red-500"> 미입력 </span>

                <span v-else class="text-green-600">
                  {{ countAttendance(attdRecordsForTable[key]) }}
                </span>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="selectedOption === 'chart'" class="px-6">
      <Chart type="bar" :height="250" :data="attdRecordsForChart" :options="chartOptions" />
    </div>

    <div v-else-if="selectedOption === 'detail'" class="px-6">
      <DataTable
        class="p-datatable-sm"
        paginator
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        :rows="6"
        :value="rawAttdRecords"
      >
        <Column header="이름" field="name" style="width: 25%" />
        <Column header="학년" field="grade" style="width: 25%" />
        <Column header="학급" field="group" style="width: 25%" />
        <Column header="출석" style="width: 25%">
          <template #body="slotProps">
            {{ formatAttendanceStatus(slotProps.data.attendance.status) }}
          </template>
        </Column>
      </DataTable>
    </div>
  </section>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { computed, onMounted, ref } from 'vue';
import type { AttendanceStatus } from '@/types';
import type { Attendance } from '@/models';
import { useAttendanceStore } from '@/store/attendance';
import { useUserStore } from '@/store/user';
import { getPreviousSunday } from '@/utils/useCalendar';
import { formatAttendanceStatus } from '@/utils/useFormat';
import AppHeader from '@/components/AppHeader.vue';

const attendanceStore = useAttendanceStore();
const userStore = useUserStore();

const setPreviousSunday = () => {
  attendanceDate.value = getPreviousSunday();
};

const popover = ref({
  visibility: 'click',
  placement: 'auto',
} as const);

const masks = ref({
  input: 'YYYY년 MM월 DD일',
});

const disabledDates = [{ repeat: { weekdays: [2, 3, 4, 5, 6, 7] } }];

const maxDate = getPreviousSunday();
const attendanceDate = ref<Date>(getPreviousSunday());

const options = [
  { label: '전체', value: 'all' },
  { label: '차트', value: 'chart' },
  { label: '개별', value: 'detail' },
];
const selectedOption = ref(options[0].value);

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
  const organizedRecords = attdRecords.reduce(
    (acc, attd) => {
      const classKey = `${attd.grade}-${attd.group}`;
      const totalKey = `${attd.grade}-T`;

      acc[classKey] = acc[classKey] || [];
      acc[classKey].push(attd);

      acc[totalKey] = acc[totalKey] || [];
      acc[totalKey].push(attd);

      return acc;
    },
    {} as { [key: string]: Attendance[] }
  );

  return Object.fromEntries(Object.entries(organizedRecords).sort());
};

const convertAttdRecordsForChart = (attdRecords: Attendance[]) => {
  const rawData = attdRecords.reduce(
    (total, record) => {
      const status = record.attendance.status ? record.attendance.status : 'empty';
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
        borderColor: ['rgb(76, 175, 80)', 'rgb(251, 192, 45)', 'rgb(255, 64, 50)', 'rgb(158, 158, 158)'],
        borderWidth: 1,
        borderRadius: 3,
      },
    ],
  };
};

const countAttendance = (records: Attendance[]) => {
  return records.filter(
    (record) => record.attendance.status === 'offline' || record.attendance.status === 'online'
  ).length;
};

const formatTotal = (key: string) => {
  const [grade, _] = key.split('-');

  const total = attdRecordsForTable.value[key].length;
  const whoAttd = countAttendance(attdRecordsForTable.value[key]);

  return `${grade}학년 - 재적: ${total} 출석: ${whoAttd}`;
};

const formatGrade = (key: string) => key.split('-').at(0) + '학년';
const formatGroup = (key: string) => {
  const group = key.split('-').at(1);
  if (group === '0') {
    return '새친구';
  }
  return group + '반';
};

const isChecked = (records: Attendance[]) => {
  return records.every((record) => !record.attendance.status);
};

const paintAttendance = (status: AttendanceStatus) => {
  return status === 'offline' || status === 'online' ? 'text-sky-700 font-semibold' : '';
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

const changeDate = async (dir: 'prev' | 'next') => {
  const date = dayjs(attendanceDate.value);

  if (dir === 'prev') {
    attendanceDate.value = date.subtract(7, 'd').toDate();
  } else if (dir === 'next') {
    attendanceDate.value = date.add(7, 'd').toDate();
  }

  await onAttendanceDateSelect();
};
</script>

<style scoped>
table {
  display: grid;
  grid-template-columns: minmax(60px, 1fr) 3fr minmax(50px, 1fr);
  overflow: auto;
}

thead,
tbody,
tr {
  display: contents;
}

/* thead th,
tbody td {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
} */

th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #bae6fd; /* sky 200 */
  padding: 10px 8px;
  color: #333;
  font-weight: normal;
  text-align: center;
}

td {
  background: #f0f9ff; /* sky 100 */
  padding: 4px;
  color: #333;
}

tr:nth-child(even) td {
  background: #e0f2fe; /* sky 50 */
}
</style>
