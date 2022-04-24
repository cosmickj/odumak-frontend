<template>
  <!-- 선생님 출석체크 -->
  <div class="attendance teacher">
    <div>선생님께서는 어디서 예배하셨나요?</div>
    <input
      type="radio"
      id="teacher-online"
      value="online"
      v-model="teacher"
      @change="$emit('test', teacher)"
      class="attendance__input"
    />
    <label
      for="teacher-online"
      class="attendance__label attendance__label__online"
    >
      <span>온라인</span>
    </label>
    <input
      type="radio"
      id="teacher-offline"
      value="offline"
      v-model="teacher"
      @change="$emit('test', teacher)"
      class="attendance__input"
    />
    <label
      for="teacher-offline"
      class="attendance__label attendance__label__offline"
    >
      <span>현장</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  teacher: string;
}>();
// const emit = defineEmits(["test"]);

const teacher = ref(props.teacher);
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
