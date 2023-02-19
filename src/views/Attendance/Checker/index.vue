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

    <ProgressSpinner v-if="isLoading" />

    <section v-else>
      <div
        v-for="(member, i) in attendances"
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
  </section>
</template>

<script setup lang="ts">
import CheckerHeader from './components/CheckerHeader.vue';

import { computed, ref, onMounted } from 'vue';
import { useAccountStore } from '@/store/account';
import { useAttendanceStore } from '@/store/attendance';
import { useMemberStore } from '@/store/member';
import type { AttendanceData } from '@/types';

const accountStore = useAccountStore();
const attendanceStore = useAttendanceStore();
const memberStore = useMemberStore();

const accountData = computed(() => accountStore.accountData!);

// https://bobbyhadz.com/blog/javascript-get-previous-sunday
const getPreviousSunday = (date = new Date()) => {
  const _date = new Date();
  _date.setDate(date.getDate() - date.getDay());
  _date.setHours(0, 0, 0, 0);
  return _date;
};

const maxDate = getPreviousSunday();
const attendanceDate = ref<Date>(getPreviousSunday());

const isLoading = ref(true);
const attendances = ref<AttendanceData[]>([]);
// const copyDataSource = ref('');

const getAttendances = async () => {
  isLoading.value = true;

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

  const result: AttendanceData[] = members.map((m) => {
    let uid = '';
    let attendance: AttendanceData['attendance'] = 'offline';

    const hasRecord = attendaces.findIndex((attd) => attd.name === m.name);

    if (hasRecord !== -1) {
      uid = attendaces[hasRecord].uid;
      attendance = attendaces[hasRecord].attendance;
    }

    return {
      uid,
      name: m.name,
      church: m.church,
      department: m.department,
      grade: m.grade,
      group: m.group,
      job: 'teacher',
      attendance,
    };
  });

  isLoading.value = false;

  return result;
  // }

  // else if (role === 'main' || role === 'sub') {}
  // else {}
};

onMounted(async () => {
  attendances.value = await getAttendances();
});

const onSubmit = () => {
  attendances.value.forEach(async (attd) => {
    if (attd.uid) {
      await attendanceStore.modifyAttendance({
        uid: attd.uid,
        attendance: attd.attendance,
      });
    } else {
      await attendanceStore.addAttendance({
        name: attd.name,
        church: attd.church,
        department: attd.department,
        grade: attd.grade,
        group: attd.group,
        job: attd.job,
        attendance: attd.attendance,
      });
    }
  });
};
</script>
