<template>
  <div v-for="(teacher, i) in teachersAttendance" :key="i" class="student">
    <div class="attendance">
      <div class="student__name">{{ teacher.name }}</div>

      <input
        type="radio"
        :id="`absence-${teacher.name}`"
        value="absence"
        v-model="teachersAttendance[i].attendance"
        class="attendance__input"
      />
      <label :for="`absence-${teacher.name}`" class="attendance__label attendance__label__absence">
        <span>결석</span>
      </label>

      <input
        type="radio"
        :id="`online-${teacher.name}`"
        value="online"
        v-model="teachersAttendance[i].attendance"
        class="attendance__input"
      />
      <label :for="`online-${teacher.name}`" class="attendance__label attendance__label__online">
        <span>온라인</span>
      </label>

      <input
        type="radio"
        :id="`offline-${teacher.name}`"
        value="offline"
        v-model="teachersAttendance[i].attendance"
        class="attendance__input"
      />
      <label :for="`offline-${teacher.name}`" class="attendance__label attendance__label__offline">
        <span>현장</span>
      </label>

      <div
        class="w-3rem h-3rem flex justify-content-center align-items-center cursor-pointer"
        @click="onClick(teacher, i)"
      >
        <i class="pi pi-angle-double-down" style="font-size: 1.5rem"></i>
      </div>
    </div>

    <div v-if="isOpen && i === currnetIndex">
      <div v-if="teacher.role === 'common'">담임 선생님이 아닙니다.</div>
      <AttendanceInputStudents v-else v-model="studentsAttendance"></AttendanceInputStudents>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { TeacherAttendance } from "@/types";
import AttendanceInputStudents from "@/components/AttendanceInputStudents.vue";
import { useStore } from "vuex";

const store = useStore();
const props = defineProps<{
  modelValue: TeacherAttendance[];
  attendanceDate: Date;
}>();
const emits = defineEmits(["update:modelValue"]);

const teachersAttendance = computed<TeacherAttendance[]>({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emits("update:modelValue", newValue);
  },
});

const studentsAttendance = ref([]);

const isOpen = ref(false);
const currnetIndex = ref<null | number>(null);

const onClick = async (teacher: any, index: number) => {
  if (teacher.role === "teacher") {
    const result = await store.dispatch("attendance/fetchStudentsAttendance", {
      date: props.attendanceDate,
      grade: teacher.grade,
      group: teacher.group,
    });

    studentsAttendance.value = result;
  }

  currnetIndex.value = index;
  isOpen.value = !isOpen.value;
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
</style>
