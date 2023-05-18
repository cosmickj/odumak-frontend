<template>
  <p class="text-xl text-center">{{ headerText }} 일일 출석현황</p>

  <Calendar
    v-model="attendanceDate"
    class="mt-5"
    input-class="text-center"
    placeholder="날짜를 선택해주세요"
    :max-date="maxDate"
    :disabled-days="[1, 2, 3, 4, 5, 6]"
    @date-select="onAttendanceDateSelect"
  />

  <div class="flex gap-x-4 py-2 items-center">
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
      <InputText
        v-model="filterKeyword"
        class="w-full"
        :disabled="layout === 'chart'"
        placeholder="검색하기"
      />
    </div>
  </div>

  <div class="flex gap-x-2 mb-2">
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
      :options="GROUP_OPTIONS"
      optionLabel="label"
      optionValue="value"
      placeholder="학급"
    />
  </div>

  <DataView
    v-if="layout !== 'chart'"
    data-key="uid"
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

    <template #list="slotProps">
      <Card>
        <template #content>
          <div class="flex gap-2 items-center justify-between">
            <p class="font-bold">
              {{ slotProps.data.name }}
            </p>

            <div
              v-if="slotProps.data.grade && slotProps.data.group"
              class="flex-1 text-sm text-center"
            >
              <p>
                {{ formatRole(slotProps.data.role) }}
              </p>
              <p>{{ slotProps.data.grade }} - {{ slotProps.data.group }}</p>
            </div>

            <div class="flex gap-2">
              <Avatar
                label="현"
                shape="circle"
                :class="statusOffline(slotProps.data.attendance.status)"
              />
              <Avatar
                label="온"
                shape="circle"
                :class="statusOnline(slotProps.data.attendance.status)"
              />
              <Avatar
                label="결"
                shape="circle"
                :class="statusAbsence(slotProps.data.attendance.status)"
              />
            </div>
          </div>
        </template>
      </Card>
    </template>

    <template #grid="slotProps">
      <Card class="col-span-1">
        <template #content>
          <div class="flex flex-col gap-2 items-center justify-between">
            <Avatar icon="pi pi-user" size="large" shape="circle" />
            <p class="font-bold">{{ slotProps.data.name }}</p>

            <div
              v-if="slotProps.data.grade && slotProps.data.group"
              class="flex-1 text-sm text-center flex gap-2"
            >
              <span>
                {{ formatRole(slotProps.data.role) }}
              </span>
              <span>
                {{ slotProps.data.grade }} - {{ slotProps.data.group }}
              </span>
            </div>

            <div v-else class="min-h-[20px]"></div>

            <div class="flex mt-2">
              <Avatar
                label="현"
                :class="statusOffline(slotProps.data.attendance.status)"
              />
              <Avatar
                label="온"
                :class="statusOnline(slotProps.data.attendance.status)"
              />
              <Avatar
                label="결"
                :class="statusAbsence(slotProps.data.attendance.status)"
              />
            </div>
          </div>
        </template>
      </Card>
    </template>
  </DataView>

  <div v-else>
    <Chart
      v-if="chartData && totalCount !== emptyCount"
      class="max-w-[300px] mx-auto"
      type="doughnut"
      :data="chartData"
    />

    <div
      v-else-if="chartData && totalCount === emptyCount"
      class="flex max-w-[300px] aspect-square mx-auto items-center justify-center"
    >
      <p class="text-xl">입력된 출석이 없습니다.</p>
    </div>

    <div v-if="chartData" class="flex mt-2 items-baseline justify-evenly">
      <p class="text-gray-500">
        학생:
        <span class="text-xl">{{ totalCount }}</span>
        <span class="text-xs">명</span>
      </p>

      <p class="text-bold">
        입력:
        <span class="text-xl">{{ totalCount - emptyCount }}</span>
        <span class="text-xs">명</span>
      </p>

      <p class="text-bold">
        미입력:
        <span class="text-xl">{{ emptyCount }}</span>
        <span class="text-xs">명</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { useAttendanceStore } from '@/store/attendance';
import { formatRole } from '@/utils/useFormat';
import { GRADE_OPTIONS, GROUP_OPTIONS } from '@/constants/common';

const router = useRouter();
const userStore = useUserStore();
const attendanceStore = useAttendanceStore();

const job = computed(() => {
  return router.currentRoute.value.params.job as 'student' | 'teacher';
});

const JobMap = { student: '학생', teacher: '교사' };
const headerText = computed(() => JobMap[job.value]);

// https://bobbyhadz.com/blog/javascript-get-previous-sunday
const getPreviousSunday = (date = new Date()) => {
  const _date = new Date();
  _date.setDate(date.getDate() - date.getDay());
  _date.setHours(0, 0, 0, 0);
  return _date;
};

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
      return (
        d.name.startsWith(filterKeyword.value) ||
        d.name.includes(filterKeyword.value)
      );
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
      const status = record.attendance.status
        ? record.attendance.status
        : 'empty';
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
  background: unset;
  border: unset;
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
