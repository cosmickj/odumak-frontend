<template>
  <section class="flex h-full flex-col overflow-auto">
    <AppHeader header="교사 일일 출석현황" route-name="HomeView" />

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

    <div class="flex items-center px-6 pb-4">
      <div class="flex-2">
        <SelectButton
          v-model="layout"
          option-label="icon"
          option-value="value"
          :options="[
            { icon: 'pi pi-chart-pie', value: 'chart' },
            { icon: 'pi pi-bars', value: 'list' },
            { icon: 'pi pi-table', value: 'grid' },
          ]"
          :unselectable="false"
        >
          <template #option="slotProps">
            <i :class="slotProps.option.icon"></i>
          </template>
        </SelectButton>
      </div>

      <div class="flex-1">
        <InputText
          v-model="filterKeyword"
          class="w-full"
          :disabled="layout === 'chart'"
          placeholder="검색하기"
        />
      </div>
    </div>

    <div class="flex gap-x-2 px-6 pb-4">
      <Dropdown
        class="w-full"
        show-clear
        v-model="filterGrade"
        :options="GRADE_OPTIONS"
        optionLabel="label"
        optionValue="value"
        placeholder="학년"
      />

      <Dropdown
        class="w-full"
        show-clear
        v-model="filterGroup"
        :options="GROUP_WITH_NEW_CLASS_OPTIONS"
        optionLabel="label"
        optionValue="value"
        placeholder="학급"
      />
    </div>

    <div v-if="layout !== 'chart'" class="px-6">
      <DataView
        data-key="memberUid"
        paginator
        paginator-template="PrevPageLink PageLinks NextPageLink RowsPerPageDropdown"
        :rows="6"
        :page-link-size="3"
        :layout="layout"
        :value="filteredAttendanceData"
      >
        <template #empty>
          <div>해당되는 내용이 없습니다</div>
        </template>

        <template #list="{ data }">
          <Card>
            <template #content>
              <div class="flex items-center justify-between gap-2">
                <div class="text-center">
                  <p class="font-bold">{{ data.name }}</p>
                  <Tag
                    v-if="data.role.teacher"
                    :value="formatTeacher(data.role.teacher)"
                    :style="`background: ${formatTeacherColor(data.role.teacher)}`"
                  />
                </div>

                <p>{{ data.grade }} - {{ data.group }}</p>

                <div class="flex gap-2">
                  <Avatar label="현" shape="circle" :class="statusOffline(data.attendance.status)" />
                  <Avatar label="온" shape="circle" :class="statusOnline(data.attendance.status)" />
                  <Avatar label="결" shape="circle" :class="statusAbsence(data.attendance.status)" />
                </div>
              </div>
            </template>
          </Card>
        </template>

        <template #grid="{ data }">
          <Card class="col-span-1">
            <template #content>
              <div class="flex flex-col items-center justify-between gap-2">
                <Avatar icon="pi pi-user" size="large" shape="circle" />
                <p class="font-bold">{{ data.name }}</p>

                <Tag
                  v-if="data.role.teacher"
                  :value="formatTeacher(data.role.teacher)"
                  :style="`background: ${formatTeacherColor(data.role.teacher)}`"
                />

                <span> {{ data.grade }} - {{ data.group }} </span>

                <div class="mt-2 flex">
                  <Avatar label="현" :class="statusOffline(data.attendance.status)" />
                  <Avatar label="온" :class="statusOnline(data.attendance.status)" />
                  <Avatar label="결" :class="statusAbsence(data.attendance.status)" />
                </div>
              </div>
            </template>
          </Card>
        </template>
      </DataView>
    </div>

    <div v-else class="px-6">
      <Chart type="bar" :height="250" :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { computed, onMounted, ref, watch } from 'vue';
import { useAttendanceStore } from '@/store/attendance';
import { useUserStore } from '@/store/user';
import { getPreviousSunday } from '@/utils/useCalendar';
import { formatTeacher, formatTeacherColor } from '@/utils/useFormat';
import { GRADE_OPTIONS, GROUP_WITH_NEW_CLASS_OPTIONS } from '@/constants/common';
import AppHeader from '@/components/AppHeader.vue';

const userStore = useUserStore();
const attendanceStore = useAttendanceStore();

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

const userData = computed(() => userStore.userData!);

const attendanceData = ref<any[]>([]);

const getAttendancesRecord = async () => {
  try {
    return await attendanceStore.fetchAttendances({
      church: userData.value.church ?? '',
      department: userData.value.department ?? '',
      job: 'teacher',
      attendanceDate: attendanceDate.value,
    });
  } catch (error) {
    console.log(error);

    return [];
  }
};

const filterGrade = ref<string | null>(null);
const filterGroup = ref<string | null>(null);
const filterKeyword = ref('');

const filteredAttendanceData = computed(() => {
  let _attendanceData = [...attendanceData.value];

  if (filterGrade.value) {
    _attendanceData = _attendanceData.filter((d) => {
      return d.grade === filterGrade.value;
    });
  }
  if (filterGroup.value) {
    _attendanceData = _attendanceData.filter((d) => {
      return d.group === filterGroup.value;
    });
  }
  if (filterKeyword.value) {
    _attendanceData = _attendanceData.filter((d) => {
      return d.name.startsWith(filterKeyword.value) || d.name.includes(filterKeyword.value);
    });
  }

  return _attendanceData;
});

const chartData = ref();
const emptyCount = ref(0);
const totalCount = ref(0);

const setChartData = () => {
  const rawData = filteredAttendanceData.value.reduce(
    (total, record) => {
      const status = record.attendance.status ? record.attendance.status : 'empty';
      const currCount = total[status] ?? 0;

      return { ...total, [status]: currCount + 1 };
    },
    { offline: 0, online: 0, absence: 0, empty: 0 }
  );

  // emptyCount.value = empty;
  // totalCount.value = filteredAttendanceData.value.length;

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
  attendanceData.value = await getAttendancesRecord();
  chartData.value = setChartData();
});

const onAttendanceDateSelect = async () => {
  attendanceData.value = await getAttendancesRecord();
  chartData.value = setChartData();
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

watch(
  () => filteredAttendanceData.value,
  () => {
    chartData.value = setChartData();
  }
);

const layout = ref<'list' | 'grid' | 'chart'>('chart');

const statusOffline = (attd: string) => {
  return attd === 'offline'
    ? 'bg-green-500 border border-green-500 text-white'
    : 'bg-slate-100 border border-slate-100';
};
const statusOnline = (attd: string) => {
  return attd === 'online'
    ? 'bg-yellow-500 border border-yellow-500 text-white'
    : 'bg-slate-100 border border-slate-100';
};
const statusAbsence = (attd: string) => {
  return attd === 'absence'
    ? 'bg-red-500 border border-red-500 text-white'
    : 'bg-slate-100 border border-slate-100';
};
</script>

<style>
.p-dataview.p-dataview-list .p-dataview-content > .p-grid > div {
  border: unset;
}
.p-dataview .p-dataview-header {
  border: unset;
  background: unset;
}
.p-dataview .p-dataview-content {
  background: unset;
}
.p-dataview-list .p-grid {
  gap: 6px;
}
.p-dataview-grid .p-grid {
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.p-dataview-grid .p-grid .p-col {
  grid-column: 1/-1;
}
.p-paginator {
  padding: 0.5rem 0;
}
.p-paginator-bottom {
  margin-top: 8px;
}
.p-card .p-card-content {
  padding: unset;
}
@media (max-width: 300px) {
  .p-dataview-grid .p-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
