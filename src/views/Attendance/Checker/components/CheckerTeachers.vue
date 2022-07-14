<template>
  <form @submit.prevent="submitTeachersAttendance">
    <div v-for="(teacher, idx) in teachersAttendance" :key="idx" class="student">
      <div class="attendance">
        <div class="student__name">{{ teacher.name }}</div>

        <input
          type="radio"
          :id="`absence-${teacher.name}`"
          value="absence"
          v-model="teachersAttendance[idx].attendance"
          class="attendance__input"
        />
        <label :for="`absence-${teacher.name}`" class="attendance__label attendance__label__absence">
          <span>결석</span>
        </label>

        <input
          type="radio"
          :id="`online-${teacher.name}`"
          value="online"
          v-model="teachersAttendance[idx].attendance"
          class="attendance__input"
        />
        <label :for="`online-${teacher.name}`" class="attendance__label attendance__label__online">
          <span>온라인</span>
        </label>

        <input
          type="radio"
          :id="`offline-${teacher.name}`"
          value="offline"
          v-model="teachersAttendance[idx].attendance"
          class="attendance__input"
        />
        <label :for="`offline-${teacher.name}`" class="attendance__label attendance__label__offline">
          <span>현장</span>
        </label>

        <!-- 선생님별 학생 출석 조회 버튼 -->
        <div
          class="w-3rem h-3rem flex align-items-center justify-content-center cursor-pointer"
          v-if="teacher.role === 'teacher'"
          @click="requestStudentsAttendance(teacher, idx)"
        >
          <i class="pi pi-sort-down" :class="{ 'pi--open': currnetIndexList.includes(idx) }"></i>
        </div>

        <div v-else class="w-3rem h-3rem flex align-items-center justify-content-center cursor-pointer">
          <i class="pi pi-minus"></i>
        </div>
      </div>

      <!-- 선생님별 학생 출석 리스트 -->
      <div class="extra" v-if="currnetIndexList.includes(idx)">
        <div v-if="!isLoading[idx] && teacher.role === 'teacher'">
          <AttendanceInputStudents
            v-model="studentsAttendanceByTeacher[teacher.name].studentsAttendance"
            :record-id="studentsAttendanceByTeacher[teacher.name].recordId"
            :attendance-date="attendanceDate"
            :writer="teacher"
            @on-uploaded:students-attendance="setRecordIdByTeacher"
          />
        </div>
      </div>
    </div>

    <Button v-if="!recordId" class="w-full p-button-lg" type="submit" label="제출하기" />
    <Button v-else class="w-full p-button-secondary p-button-lg" type="submit" label="수정하기" />
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AttendanceInputStudents from '@/components/AttendanceInputStudents.vue';
// import { useStore } from "vuex";
import { Teacher, Student } from '@/types';

// const store = useStore();
const props = defineProps<{
  modelValue: Teacher[];
  recordId: string;
  attendanceDate: Date;
}>();
const emit = defineEmits(['update:modelValue', 'onUploaded:teachersAttendance']);

const teachersAttendance = computed<Teacher[]>({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue),
});

const isLoading = ref<boolean[]>([]);
const currnetIndexList = ref<number[]>([]);
const studentsAttendanceByTeacher = ref<any>({}); // TODO: 타입 정의 다시하기

watch(
  () => props.attendanceDate,
  () => {
    currnetIndexList.value = [];
    studentsAttendanceByTeacher.value = {};
  }
);

const requestStudentsAttendance = async (teacher: Teacher, currentIndex: number) => {
  // isLoading.value = Array(currentIndex).fill(false);
  // isLoading.value[currentIndex] = true;
  // const targetIndex = currnetIndexList.value.indexOf(currentIndex);
  // if (targetIndex === -1) {
  //   currnetIndexList.value.push(currentIndex);
  // } else {
  //   currnetIndexList.value.splice(targetIndex, 1);
  // }
  // if (teacher.role === "teacher") {
  //   if (studentsAttendanceByTeacher.value[teacher.name]) {
  //     // pass
  //   } else {
  //     const result = await store.dispatch("attendance/fetchStudentsAttendance", {
  //       date: props.attendanceDate,
  //       grade: teacher.grade,
  //       group: teacher.group,
  //       teacher: teacher.name,
  //     });
  //     result.studentsAttendance.forEach((student: Student) => {
  //       if (!student.attendance) student.attendance = "offline";
  //     });
  //     studentsAttendanceByTeacher.value[teacher.name] = {
  //       recordId: result.recordId,
  //       studentsAttendance: result.studentsAttendance,
  //     };
  //   }
  // }
  // isLoading.value[currentIndex] = false;
};

const submitTeachersAttendance = async () => {
  // const params = {
  //   recordId: props.recordId,
  //   date: props.attendanceDate,
  //   teachersAttendance: teachersAttendance.value,
  // };
  // const { id } = await store.dispatch("attendance/addTeachersAttendance", params);
  // emit("onUploaded:teachersAttendance", { id });
  // if (!props.recordId) alert("제출되었습니다.");
  // else alert("수정되었습니다.");
};

const setRecordIdByTeacher = ({ id, teacher }: { id: string; teacher: string }) => {
  studentsAttendanceByTeacher.value[teacher].recordId = id;
};
</script>

<style scoped>
.attendance {
  padding: 1rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 10px 0;
  border-radius: 3px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  background: #efefef95;
}
.attendance__input {
  display: none;
  height: 0;
  width: 0;
}
.attendance__label {
  height: 48px;
  width: 48px;
  font-size: 0.6rem;
  margin: 0 4px 0 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px #00000029;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0.4;
}
.attendance__input:checked + .attendance__label {
  opacity: 1;
  animation: jelly 0.6s ease;
  font-weight: bold;
}
.attendance__label__offline {
  background-color: #4caf50;
  color: #28334aff;
}
.attendance__label__online {
  background-color: #fbc02d;
  color: #28334aff;
}
.attendance__label__absence {
  background-color: #ff4032;
  color: #28334aff;
}
.pi {
  font-size: 1.5rem;
  transition: all 0.3s;
}
.pi--open {
  transform: rotate(180deg);
}
.extra {
  width: 95%;
  margin-left: auto;
}
.extra :deep(.attendance) {
  background-color: #cccccc80;
}
button[class^='p-button'] {
  position: sticky;
  bottom: 0.5rem;
}
</style>
