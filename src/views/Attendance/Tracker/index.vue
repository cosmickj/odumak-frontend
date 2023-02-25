<template>
  <div class="overflow-auto flex flex-col h-full p-4">
    <p class="text-2xl text-center">{{ headerText }} 일일 출석현황</p>

    <Calendar
      touchUI
      v-model="attendanceDate"
      class="my-5"
      input-class="text-center"
      placeholder="날짜를 선택해주세요"
      :max-date="maxDate"
      :disabledDays="[1, 2, 3, 4, 5, 6]"
      @date-select="onAttendanceDateSelect"
    />

    <ProgressSpinner v-if="isLoading" />

    <RouterView v-else />
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

// https://bobbyhadz.com/blog/javascript-get-previous-sunday
const getPreviousSunday = (date = new Date()) => {
  const _date = new Date();
  _date.setDate(date.getDate() - date.getDay());
  _date.setHours(0, 0, 0, 0);
  return _date;
};

const maxDate = getPreviousSunday();
const attendanceDate = ref<Date>(getPreviousSunday());

const job = computed(() => {
  return router.currentRoute.value.params.job as 'student' | 'teacher';
});
const HeaderTextMap = { student: '학생', teacher: '교사' };
const headerText = computed(() => HeaderTextMap[job.value]);

const isLoading = ref(false);
const attendancesRecord = ref<any[]>([]);

const accountData = computed(() => accountStore.accountData!);

const getAttendancesRecord = async () => {
  try {
    isLoading.value = true;

    attendancesRecord.value = await attendanceStore.fetchAttendances({
      church: accountData.value.church,
      department: accountData.value.department,
      job: job.value,
      attendanceDate: attendanceDate.value,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getAttendancesRecord();
});

const onAttendanceDateSelect = () => {
  console.log('onAttendanceDateSelect');
};
</script>

<style scoped></style>
