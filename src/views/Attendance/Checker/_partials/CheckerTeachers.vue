<template>
  <template v-for="(attendance, i) in attendances" :key="i">
    <div
      v-if="attendance.role?.teacher == 'head'"
      class="mt-[-1px] flex items-center justify-around border border-slate-300 py-2"
    >
      <template v-if="attendance.role?.teacher == 'head'">
        <Tag
          :value="formatTeacher(attendance.role?.teacher)"
          :style="`background: ${formatTeacherColor(attendance.role?.teacher)}`"
        />
        <span>{{ attendance.name }}</span>
        <span>
          {{ formatClassName(attendance.grade, attendance.group) }}
        </span>

        <Button
          v-if="attendance.role?.teacher === 'head'"
          rounded
          severity="secondary"
          icon="pi pi-plus"
          @click="getSubAttendances(attendance)"
        />

        <!-- <SelectButton
          v-model="attendance.attendance.status"
          class="flex [&>*:nth-child(1)]:flex-1 xs:[&>*:nth-child(2)]:flex-1 [&>*:nth-child(3)]:flex-1"
          :options="[
            { name: '현장', value: 'offline' },
            { name: '온라인', value: 'online' },
            { name: '결석', value: 'absence' },
          ]"
          option-label="name"
          option-value="value"
        /> -->
      </template>
    </div>
  </template>

  <Dialog
    modal
    v-model:visible="visible"
    class="p-dialog-custom"
    header="담당 학생 출석 체크"
    :style="{ width: '360px' }"
    :breakpoints="{ '641px': '95vw' }"
  >
    <div v-if="!subAttendances.length" class="text-center text-base">해당 날짜에 입력할 인원이 없습니다.</div>

    <CheckerStudents :attendances="subAttendances" />

    <template #footer>
      <Button text label="닫기" size="small" @click="visible = false" />
      <Button severity="warning" label="저장" size="small" :disabled="!changed" @click="saveSubAttendances" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { computed, ref, toRaw } from 'vue';
import type { Attendance } from '@/models';
import { useAttendanceStore } from '@/store/attendance';
import { useUserStore } from '@/store/user';
import { formatClassName, formatTeacher, formatTeacherColor } from '@/utils/useFormat';
import CheckerStudents from './CheckerStudents.vue';

const props = defineProps<{
  attendances: Attendance[];
  attendanceDate: Date;
}>();

const attendanceStore = useAttendanceStore();
const userStore = useUserStore();

const toast = useToast();

const visible = ref(false);
const isLoading = ref(false);
const subAttendances = ref<Attendance[]>([]);
const subAttendancesClone = ref<Attendance[]>([]);

const changed = computed(() => {
  const attd = subAttendances.value;
  const clone = subAttendancesClone.value;

  return JSON.stringify(attd) !== JSON.stringify(clone);
});

const getSubAttendances = async (attd: Attendance) => {
  try {
    isLoading.value = true;

    subAttendances.value = await attendanceStore.fetchAttendancesByGradeGroup({
      attendanceDate: props.attendanceDate,
      church: attd.church!,
      department: attd.department!,
      grade: attd.grade,
      group: attd.group,
      job: 'student',
    });
    subAttendancesClone.value = structuredClone(toRaw(subAttendances.value));

    visible.value = true;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const saveSubAttendances = () => {
  try {
    const userData = userStore.userData;
    if (!userData) {
      return;
    }

    subAttendances.value.forEach(async (attd) => {
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
          date: props.attendanceDate,
          status: attd.attendance.status ? attd.attendance.status : 'absence',
        },
        createdBy: userData.name,
      });
    });

    toast.add({
      severity: 'success',
      detail: '추가되었습니다',
      life: 1000,
    });

    visible.value = false;
  } catch (error) {
    console.log(error);
  }
};
</script>

<style>
.p-dialog-custom .p-dialog-content {
  padding: unset;
}
.p-dialog-custom .p-dialog-footer {
  padding: 16px;
}
@media (max-width: 320px) {
  .p-dialog-custom .p-dialog-content {
    font-size: 12px;
  }
  .p-dialog-custom .p-component {
    font-size: 12px;
  }
}
</style>
