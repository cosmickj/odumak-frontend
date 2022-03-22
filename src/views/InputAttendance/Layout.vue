<template>
  <div id="input-attendance">
    <div class="input-attendance__container">
      <div class="title__container">
        <span class="title">출석 입력하기</span>
        <span class="fz-16">3-1</span>
        <span class="fz-16">이경준 선생님</span>
      </div>

      <div class="calendar__container pt-10">
        <Calendar
          v-model="selectedDate"
          class="w-100"
          :touchUI="true"
          :showIcon="true"
          :disabledDays="[1, 2, 3, 4, 5, 6]"
          @date-select="onDateSelect"
        />
      </div>

      <form v-if="selectedDate" @submit.prevent="onSubmit">
        <Students v-if="stage === 'students'"></Students>
        <Teacher v-if="stage === 'teacher'"></Teacher>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import Students from "./Students.vue";
import Teacher from "./Teacher.vue";

export default defineComponent({
  name: "InputAttendanceLayout",
  components: {
    Students,
    Teacher,
  },
  setup() {
    const store = useStore();
    const userInfo = computed(() => store.state.user.info);
    const selectedDate = ref<any>(null);
    const stage = computed(() => store.state.attendance.stage);
    const moveStage = (stage: string) =>
      store.commit("attendance/SET_STAGE", stage);
    const onDateSelect = async () => {
      moveStage("students");
      await store.dispatch("attendance/checkRecord", {
        name: userInfo.value.name,
        date: selectedDate.value,
      });
    };
    const onSubmit = () => {
      console.log("submitted");
    };
    return {
      stage,
      selectedDate,
      onDateSelect,
      onSubmit,
    };
  },
});
</script>

<style scoped>
#input-attendance {
  min-height: 100vh;
  max-height: 100vh;
  overflow: auto;
}
.input-attendance__container {
  padding: var(--container-padding);
}
.title__container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  font-size: 1.6rem;
  color: var(--color-black);
}
</style>
