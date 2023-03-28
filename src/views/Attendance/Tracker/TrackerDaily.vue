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

  <DataView
    data-key="uid"
    :layout="layout"
    :value="attendanceStore.attendancesRecord.daily"
  >
    <template #header>
      <div class="flex justify-between">
        <div>
          <!-- <Dropdown
            v-model="sortKey"
            :options="sortOptions"
            optionLabel="label"
            placeholder="Sort By Price"
            @change="onSortChange($event)"
          /> -->
        </div>
        <SelectButton
          v-model="layout"
          option-label="icon"
          option-value="value"
          :unselectable="false"
          :options="[
            { icon: 'pi pi-bars', value: 'list' },
            { icon: 'pi pi-table', value: 'grid' },
          ]"
        >
          <template #option="slotProps">
            <i :class="slotProps.option.icon"></i>
          </template>
        </SelectButton>
      </div>
    </template>

    <template #empty>
      <div class="absolute left-1/2 translate-x-[-50%]">
        입력된 내용이 없습니다
      </div>
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

const getAttendancesRecord = async () => {
  try {
    await attendanceStore.fetchAttendances({
      church: accountData.value.church,
      department: accountData.value.department,
      job: job.value,
      attendanceDate: attendanceDate.value,
    });
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await getAttendancesRecord();
});

const onAttendanceDateSelect = async () => {
  await getAttendancesRecord();
};

const layout = ref<'list' | 'grid'>('list');

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
  height: 100%;
  background: unset;
}
.p-dataview-list .p-grid {
  gap: 6px;
}
.p-dataview-grid .p-grid {
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
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
