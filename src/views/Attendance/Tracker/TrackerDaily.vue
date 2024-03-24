<template>
  <p class="text-center text-xl">{{ headerText }} 일일 출석현황</p>

  <Calendar
    v-model="attendanceDate"
    class="mt-5"
    input-class="text-center"
    placeholder="날짜를 선택해주세요"
    :max-date="maxDate"
    :disabled-days="[1, 2, 3, 4, 5, 6]"
    @date-select="onAttendanceDateSelect"
  />

  <div class="flex items-center gap-x-4 py-2">
    <div class="flex-2">
      <SelectButton
        v-model="layout"
        unselectable
        option-label="icon"
        option-value="value"
        :options="[
          { icon: 'pi pi-chart-pie', value: 'chart' },
          { icon: 'pi pi-bars', value: 'list' },
          { icon: 'pi pi-table', value: 'grid' },
        ]"
      >
        <template #option="slotProps">
          <i :class="slotProps.option.icon"></i>
        </template>
      </SelectButton>
    </div>

    <div class="flex-1">
      <InputText v-model="filterKeyword" class="w-full" :disabled="layout === 'chart'" placeholder="검색하기" />
    </div>
  </div>

  <div class="mb-2 flex gap-x-2">
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

  <DataView
    v-if="layout !== 'chart'"
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

  <div v-else>
    <Chart
      v-if="chartData && totalCount !== emptyCount"
      class="mx-auto max-w-[300px]"
      type="doughnut"
      :data="chartData"
    />

    <div
      v-else-if="chartData && totalCount === emptyCount"
      class="mx-auto flex aspect-square max-w-[300px] items-center justify-center"
    >
      <p class="text-xl">입력된 출석이 없습니다.</p>
    </div>

    <div v-if="chartData" class="mt-2 flex items-baseline justify-evenly">
      <p class="text-gray-500">
        총:
        <span class="text-xl">{{ totalCount }}</span>
        <span class="text-xs">명</span>
      </p>

      <p class="text-bold">
        미입력:
        <span class="text-xl">{{ emptyCount }}</span>
        <span class="text-xs">명</span>
      </p>

      <p class="text-bold text-lg text-green-700">
        입력:
        <span class="text-2xl">{{ totalCount - emptyCount }}</span>
        <span class="text-sm">명</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAttendanceStore } from '@/stores/attendance';
import { useUserStore } from '@/stores/user';
import { getPreviousSunday } from '@/utils/useCalendar';
import { formatTeacher, formatTeacherColor } from '@/utils/useFormat';
import { GRADE_OPTIONS, GROUP_WITH_NEW_CLASS_OPTIONS } from '@/constants/common';

const router = useRouter();
const userStore = useUserStore();
const attendanceStore = useAttendanceStore();

const job = computed(() => {
  return router.currentRoute.value.params.job as 'student' | 'teacher';
});

const JobMap = { student: '학생', teacher: '교사' };
const headerText = computed(() => JobMap[job.value]);

const maxDate = getPreviousSunday();
const attendanceDate = ref<Date>(getPreviousSunday());

const userData = computed(() => userStore.userData!);

const attendanceData = ref<any[]>([]);

const getAttendancesRecord = async () => {
  try {
    await attendanceStore.fetchAttendances({
      church: userData.value.church!,
      department: userData.value.department!,
      job: job.value,
      attendanceDate: attendanceDate.value,
    });
  } catch (error) {
    console.log(error);
  } finally {
    return attendanceStore.attendancesRecord.daily;
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
  const documentStyle = getComputedStyle(document.body);

  const rawData = filteredAttendanceData.value.reduce(
    (total, record) => {
      const status = record.attendance.status ? record.attendance.status : 'empty';
      const currCount = total[status] ?? 0;

      return { ...total, [status]: currCount + 1 };
    },
    { offline: 0, online: 0, absence: 0, empty: 0 }
  );

  const { empty, ...data } = rawData;

  emptyCount.value = empty;
  totalCount.value = filteredAttendanceData.value.length;

  return {
    labels: ['현장', '온라인', '결석'],
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          documentStyle.getPropertyValue('--green-500'),
          documentStyle.getPropertyValue('--yellow-500'),
          documentStyle.getPropertyValue('--red-500'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--green-400'),
          documentStyle.getPropertyValue('--yellow-400'),
          documentStyle.getPropertyValue('--red-400'),
        ],
      },
    ],
  };
};

onMounted(async () => {
  attendanceData.value = await getAttendancesRecord();
  chartData.value = setChartData();
});

watch(
  () => filteredAttendanceData.value,
  () => {
    chartData.value = setChartData();
  }
);

const onAttendanceDateSelect = async () => {
  attendanceData.value = await getAttendancesRecord();
  chartData.value = setChartData();
};

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
