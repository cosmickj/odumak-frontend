<template>
  <section class="flex flex-col h-full p-8">
    <CheckerHeader @submit="onSubmit" />

    <Calendar
      v-model="attendanceDate"
      class="my-5"
      touchUI
      input-class="text-center"
      placeholder="날짜를 선택해주세요"
      :max-date="maxDate"
      :disabledDays="[1, 2, 3, 4, 5, 6]"
      @date-select="getAttendances"
    />

    <div
      v-for="(member, i) in members"
      class="flex mt-[-1px] px-2 py-3 border border-slate-300 items-center justify-between"
      :key="i"
    >
      <span>{{ member.name }}</span>

      <SelectButton
        v-model="member.attendance"
        :options="[
          { name: '현장', value: 'offline' },
          { name: '온라인', value: 'online' },
          { name: '결석', value: 'absence' },
        ]"
        option-label="name"
        option-value="value"
      />

      <Button
        icon="pi pi-chevron-down"
        class="p-button-rounded p-button-text p-button-secondary p-button-sm"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import CheckerHeader from './components/CheckerHeader.vue';

import { computed, ref, onMounted } from 'vue';
import { useAccountStore } from '@/store/account';
import { useAttendanceStore } from '@/store/attendance';
import { useMemberStore } from '@/store/member';
import type { MemberData } from '@/types';

const accountStore = useAccountStore();
const attendanceStore = useAttendanceStore();
const memberStore = useMemberStore();

const accountData = computed(() => accountStore.accountData!);
const members = ref<MemberData[]>([]);
const isLoading = ref(false);
const copyDataSource = ref('');

const attendanceDate = ref<Date>(getPreviousSunday());
const maxDate = getPreviousSunday();

// https://bobbyhadz.com/blog/javascript-get-previous-sunday
function getPreviousSunday(date = new Date()) {
  const _date = new Date();
  _date.setDate(date.getDate() - date.getDay());
  _date.setHours(0, 0, 0, 0);
  return _date;
}

const getAttendances = async () => {
  const role = accountData.value.role;

  // if (role === 'admin') {
  const members = await memberStore.fetchAll({
    church: accountData.value.church,
    department: accountData.value.department,
    job: 'teacher',
  });

  const attendaces = await attendanceStore.fetchAttendances({
    church: accountData.value.church,
    department: accountData.value.department,
    job: 'teacher',
  });

  members.forEach((member) => {
    const result = attendaces.find((attendace) => attendace.data());
    if (!result) {
      member.attendance = 'offline';
    }
  });

  return members;
  // }

  // else if (role === 'main' || role === 'sub') {}
  // else {}
};

onMounted(async () => {
  members.value = await getAttendances();
});

// CONTINUE: 출석 체크한거 저장하기
const onSubmit = () => {
  console.table(members.value);
};

// const submitAttendance = async () => {
//   try {
//     if (!accountStore.accountData) return;

//     await attendanceStore.addAttendances({
//       attendances: members.value,
//       church: accountStore.accountData.church,
//       checksum: copyDataSource.value,
//       department: accountStore.accountData.department,
//       grade: accountStore.accountData.grade,
//       group: accountStore.accountData.group,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const isTeacher = (role) => {
//   if (role === 'main' || role === 'sub') return true;
//   return false;
// };

// const isAdmin = (role) => {
//   if (role === 'admin') return true;
//   return false;
// };
</script>
