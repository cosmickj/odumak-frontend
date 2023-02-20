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
      @date-select="getAttendancesTemplate"
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
          v-model="member.attendance.status"
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
const attendances = ref<AttendanceData[] | undefined>([]);
// const copyDataSource = ref('');

const getAttendancesTemplate = async () => {
  try {
    let template: AttendanceData[];
    isLoading.value = true;

    const role = accountData.value.role;
    if (role === 'admin') {
      const members = await memberStore.fetchAll({
        church: accountData.value.church,
        department: accountData.value.department,
        job: 'teacher',
      });

      const attendaces = await attendanceStore.fetchAttendances({
        church: accountData.value.church,
        department: accountData.value.department,
        job: 'teacher',
        attendanceDate: attendanceDate.value,
      });

      template = members.map((mem) => {
        let uid = '';
        let status: AttendanceData['attendance']['status'] = 'offline';

        const hasRecord = attendaces.findIndex((attd) => {
          return attd.name === mem.name;
        });

        if (hasRecord !== -1) {
          uid = attendaces[hasRecord].uid;
          status = attendaces[hasRecord].attendance.status;
        }

        return {
          uid,
          name: mem.name,
          church: mem.church,
          department: mem.department,
          grade: mem.grade,
          group: mem.group,
          job: 'teacher',
          attendance: {
            date: attendanceDate.value,
            status,
          },
        };
      });

      attendances.value = template;
    }

    // else if (role === 'main' || role === 'sub') {}
    // else {}
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => await getAttendancesTemplate());

const onSubmit = () => {
  attendances.value?.forEach(async (attd) => {
    if (attd.uid) {
      await attendanceStore.modifyAttendance({
        uid: attd.uid,
        attendance: {
          status: attd.attendance.status,
        },
      });
    } else {
      await attendanceStore.addAttendance({
        name: attd.name,
        church: attd.church,
        department: attd.department,
        grade: attd.grade,
        group: attd.group,
        job: attd.job,
        attendance: {
          date: attendanceDate.value,
          status: attd.attendance.status,
        },
        createdBy: accountData.value.name,
      });
    }
  });
};
</script>
