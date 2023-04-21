<template>
  <p class="text-xl text-center">{{ headerText }} 일일 출석현황</p>

  <Calendar
    v-model="attendanceDate"
    class="mt-5"
    input-class="text-center"
    placeholder="날짜를 선택해주세요"
    :max-date="maxDate"
    :disabledDays="[1, 2, 3, 4, 5, 6]"
    @date-select="onAttendanceDateSelect"
  />

  <div class="flex py-2 justify-end">
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

  <p v-if="layout !== 'chart'" class="mb-2 p-input-icon-left">
    <i class="pi pi-search" />
    <InputText
      class="w-full p-inputtext-sm"
      placeholder="검색하기"
      @update:model-value="filterKeyword"
    />
  </p>

  <DataView
    v-if="layout !== 'chart'"
    data-key="uid"
    paginator
    :rows="6"
    :page-link-size="2"
    :layout="layout"
    :value="attendanceData"
  >
    <template #empty>
      <div>입력된 내용이 없습니다</div>
    </template>

    <template #list="slotProps">
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <Avatar icon="pi pi-user" size="large" shape="circle" />
            <div class="text-center">
              <p>{{ slotProps.data.grade }} - {{ slotProps.data.group }}</p>
              <p class="font-bold">{{ slotProps.data.name }}</p>
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
          <div class="flex flex-col gap-2 items-center justify-center">
            <Avatar icon="pi pi-user" size="large" shape="circle" />
            <p>{{ slotProps.data.grade }} - {{ slotProps.data.group }}</p>
            <p class="font-bold">{{ slotProps.data.name }}</p>
            <div class="flex gap-3 mt-2">
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
  </DataView>

  <div v-else>
    <Chart type="doughnut" :data="chartData" />

    <p v-if="chartData" class="mt-4 flex gap-2 items-baseline justify-center">
      <span class="text-sm">미입력:</span>
      <span class="text-xl text-gray-600 font-bold">{{ emptyCount }}</span>
      <span class="text-sm">/ {{ totalCount }}명</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';
import { useAttendanceStore } from '@/store/attendance';

const router = useRouter();
const accountStore = useAccountStore();
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

const accountData = computed(() => accountStore.accountData!);
const attendanceData = ref<any[]>([]);

const getAttendancesRecord = async () => {
  try {
    await attendanceStore.fetchAttendances({
      church: accountData.value.church!,
      department: accountData.value.department!,
      job: job.value,
      attendanceDate: attendanceDate.value,
    });
    attendanceData.value = attendanceStore.attendancesRecord.daily;
  } catch (error) {
    console.log(error);
  }
};

const chartData = ref();
const emptyCount = ref(0);
const totalCount = ref(0);

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body);

  const rawData = attendanceStore.attendancesRecord.daily.reduce(
    (total, record) => {
      const status = record.attendance.status
        ? record.attendance.status
        : 'empty';
      const currCount = total[status] ?? 0;

      return {
        ...total,
        [status]: currCount + 1,
      };
    },
    { offline: 0, online: 0, absence: 0, empty: 0 }
  );

  const { empty, ...data } = rawData;

  emptyCount.value = empty;
  totalCount.value = attendanceStore.attendancesRecord.daily.length;

  return {
    labels: Object.keys(data),
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
  await getAttendancesRecord();

  chartData.value = setChartData();
});

const onAttendanceDateSelect = async () => {
  await getAttendancesRecord();
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

const filterKeyword = (keyword: string) => {
  if (!keyword) {
    return;
  }
  // CONTINUE: 필터를 위해 데이터 복사가 필요하다
  attendanceData.value = attendanceData.value.filter((d) => {
    return d.name.startsWith(keyword);
  });
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
