<template>
  <div class="teacher-wrapper mt-20">
    <div class="teacher-container fz-16">
      <div class="question">선생님께서는 어디서 예배하셨나요?</div>
      <div class="btn-container mt-20 flex">
        <input
          type="radio"
          name="attendance"
          id="teacher-offline"
          value="offline"
          v-model="teacherAttendance"
          checked
        />
        <label for="teacher-offline" class="mr-10">현장예배</label>

        <input
          type="radio"
          name="attendance"
          id="teacher-online"
          value="online"
          v-model="teacherAttendance"
        />
        <label for="teacher-online" class="ml-10">온라인</label>
      </div>
    </div>
    <div class="mt-20">
      <Button
        type="button"
        label="이전"
        class="btn-block p-button-success p-button-raised"
        @click="moveStage('students')"
      />
    </div>
    <div class="mt-10">
      <Button
        type="submit"
        label="제출하기"
        class="btn-block p-button-warning p-button-raised"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "InputAttendanceTeacher",
  setup() {
    const store = useStore();
    const teacherAttendance = ref(null);
    const moveStage = (stage: string) =>
      store.commit("attendance/SET_STAGE", stage);
    return {
      teacherAttendance,
      moveStage,
    };
  },
});
</script>

<style scoped>
.teacher-wrapper {
  padding: 1rem;
}
.question {
  text-align: center;
}
#teacher-offline,
#teacher-online {
  display: none;
}
#teacher-offline ~ label,
#teacher-online ~ label {
  width: 50%;
  aspect-ratio: 1 / 1;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px #00000029;
  border-radius: 10%;
  cursor: pointer;
  opacity: 0.4;
}
#teacher-offline + label {
  background-color: #4caf50;
  color: #28334aff;
}
#teacher-online + label {
  background-color: #fbc02d;
  color: #28334aff;
}
#teacher-offline:checked + label,
#teacher-online:checked + label {
  opacity: 1;
  animation: jelly 0.6s ease;
  font-weight: bold;
}
</style>
