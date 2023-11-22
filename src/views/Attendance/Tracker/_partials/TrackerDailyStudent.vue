<template>
  <AppHeader header="학생 일일 출석현황" route-name="HomeView" />

  <div class="p-4">
    <Calendar
      v-model="attendanceDate"
      input-class="text-center"
      placeholder="날짜를 선택해주세요"
      :max-date="maxDate"
      :disabled-days="[1, 2, 3, 4, 5, 6]"
      @date-select="onAttendanceDateSelect"
    />

    <div class="mt-2 text-center">
      <SelectButton
        unselectable
        v-model="selectedOption"
        option-label="label"
        option-value="value"
        :options="options"
      />
    </div>

    <div v-if="selectedOption === 'all'" class="mt-2 pb-12">
      <!-- <p class="text-sm"><sup>*</sup> 각 학년반을 클릭해보세요</p> -->
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
              <td class="text-sm">
                <p class="min-w-[36px]">{{ formatGrade(key) }}</p>
                <p class="min-w-[36px]">{{ formatGroup(key) }}</p>
              </td>

              <td class="grid grid-cols-3 grid-rows-2 gap-1 xs:grid-cols-4">
                <span
                  v-for="(attd, j) in attdRecordsForTable[key]"
                  class="whitespace-nowrap text-center text-sm"
                  :class="paintAttendance(attd.attendance.status)"
                  :key="j"
                >
                  {{ attd.name }}
                </span>
              </td>

              <td class="relative">
                <span v-if="isChecked(attdRecordsForTable[key])" class="text-sm text-red-500"> 미입력 </span>

                <span v-else class="text-green-600">
                  {{ countAttendance(attdRecordsForTable[key]) }}
                </span>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="selectedOption === 'chart'" class="mt-6">
      <Chart type="bar" :height="250" :data="attdRecordsForChart" :options="chartOptions" />
    </div>

    <div v-else-if="selectedOption === 'detail'" class="mt-6">
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
  </div>
</template>

<script setup lang="ts">
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

const maxDate = getPreviousSunday();
const attendanceDate = ref<Date>(getPreviousSunday());

const options = [
  { label: '전체 보기', value: 'all' },
  { label: '차트 보기', value: 'chart' },
  { label: '개별 보기', value: 'detail' },
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

thead th,
tbody td {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

th {
  z-index: 2;
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
