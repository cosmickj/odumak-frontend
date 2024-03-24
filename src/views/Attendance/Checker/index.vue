<template>
  <div>
    <section class="overflow-auto">
      <AppHeader header="출석체크" route-name="HomeView" />

      <div class="flex gap-2 px-6 py-4">
        <Button rounded class="p-button-blue" icon="pi pi-chevron-left" @click="changeDate('prev')" />

        <DatePicker
          v-model="attendanceDate"
          locale="ko"
          :popover="popover"
          :masks="masks"
          :disabled-dates="disabledDates"
          :max-date="maxDate"
          @update:modelValue="getAttendances"
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

      <div class="flex justify-end px-6">
        <span v-if="userData.role.system === 'admin' || userData.role.executive === 'secretary'">
          {{ userData.church }} {{ userData.department }} 교사
        </span>

        <span v-else-if="userData.role.system === 'user'">
          {{ formatClassName(userData.grade, userData.group) }}
        </span>

        <span>(총 {{ attendances.length }}명)</span>
      </div>

      <ProgressSpinner v-if="isLoading" />

      <div v-else class="px-6">
        <CheckerTeachers
          v-if="userData.role.system === 'admin' || userData.role.executive === 'secretary'"
          :attendances="attendances"
          :attendance-date="attendanceDate"
        />

        <CheckerStudents
          v-else-if="userData.role.teacher === 'head' || userData.role.teacher === 'assistant'"
          :attendances="attendances"
        />

        <Dialog
          v-else
          modal
          header="담임이 아닙니다"
          v-model:visible="visible"
          :breakpoints="{ '450px': '85vw' }"
          @hide="router.push({ name: 'HomeView' })"
        >
          <p>출석 체크는 담임, 부담임 선생님만 이용할 수 있습니다.</p>

          <template #footer>
            <Button
              label="알겠습니다"
              class="p-button-info"
              icon="pi pi-check"
              @click="router.push({ name: 'HomeView' })"
            />
          </template>
        </Dialog>
      </div>
    </section>

    <section class="mt-auto px-6 pb-8 pt-4">
      <Button
        class="z-10 w-full bg-yellow-300 py-2 text-lg"
        label="출석 저장하기"
        :disabled="!isChanged"
        @click="saveAttendances"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti';
import dayjs from 'dayjs';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { computed, onMounted, ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import type { Attendance } from '@/models';
import { useAttendanceStore } from '@/stores/attendance';
import { useUserStore } from '@/stores/user';
import { getPreviousSunday } from '@/utils/useCalendar';
import { formatClassName } from '@/utils/useFormat';
import AppHeader from '@/components/AppHeader.vue';
import CheckerStudents from './_partials/CheckerStudents.vue';
import CheckerTeachers from './_partials/CheckerTeachers.vue';

const router = useRouter();
const userStore = useUserStore();
const attendanceStore = useAttendanceStore();

const maxDate = getPreviousSunday();
const attendanceDate = ref<Date>(getPreviousSunday());

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

const isLoading = ref(false);
const attendances = ref<Attendance[]>([]);
const attendancesClone = ref<Attendance[]>([]);

const isChanged = computed(() => {
  const attd = attendances.value;
  const clone = attendancesClone.value;

  return JSON.stringify(attd) !== JSON.stringify(clone);
});

const visible = ref(true);
const userData = computed(() => userStore.userData!);

const getAttendances = async () => {
  try {
    isLoading.value = true;

    const { system, executive } = userData.value.role;

    if (system === 'admin' || executive === 'secretary') {
      attendances.value = await attendanceStore.fetchAttendances({
        attendanceDate: attendanceDate.value,
        church: userData.value.church,
        department: userData.value.department,
        job: 'teacher',
      });
      return;
    }

    if (system === 'user') {
      attendances.value = await attendanceStore.fetchAttendancesByGradeGroup({
        attendanceDate: attendanceDate.value,
        church: userData.value.church,
        department: userData.value.department,
        grade: userData.value.grade,
        group: userData.value.group,
        job: 'student',
      });
      return;
    }
  } catch (error) {
    console.log(error);
  } finally {
    attendancesClone.value = structuredClone(toRaw(attendances.value));
    isLoading.value = false;
  }
};

const changeDate = async (dir: 'prev' | 'next') => {
  const date = dayjs(attendanceDate.value);

  if (dir === 'prev') {
    attendanceDate.value = date.subtract(7, 'd').toDate();
  } else if (dir === 'next') {
    attendanceDate.value = date.add(7, 'd').toDate();
  }

  await getAttendances();
};

onMounted(async () => {
  await getAttendances();
});

const saveAttendances = async () => {
  try {
    attendances.value.forEach(async (attd) => {
      if (attd.uid) {
        return await attendanceStore.modifyAttendance({
          uid: attd.uid,
          attendance: { status: attd.attendance.status },
        });
      }

      return await attendanceStore.addAttendance({
        memberUid: attd.memberUid,
        name: attd.name,
        church: attd.church,
        department: attd.department,
        grade: attd.grade,
        group: attd.group,
        job: attd.job,
        attendance: {
          date: attendanceDate.value,
          status: attd.attendance.status ? attd.attendance.status : 'absence',
        },
        createdBy: userData.value.name,
      });
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    alert('저장되었습니다!');
    // await getAttendances();
  } catch (error) {
    console.log(error);
  }
};
</script>
