<template>
  <div id="input-attendance">
    <div class="input-attendance__container">
      <div class="title__container">
        <h2 class="title">출석 입력하기</h2>
        <span>이경준 선생님</span>
        <span>3-1</span>
      </div>

      <div class="calendar__container pt-10">
        <Calendar
          v-model="selectedDate"
          class="w-100"
          :touchUI="true"
          :showIcon="true"
          :disabledDays="[1, 2, 3, 4, 5, 6]"
        />
      </div>

      <form @submit.prevent="onSubmit">
        <div v-for="(student, i) in students" :key="i" class="student">
          <div class="student__name">{{ student.name }}</div>
          <div class="student__birth">{{ student.birth }}</div>
          <div class="student__attendance">
            <input
              type="radio"
              :name="student.name"
              :id="`${student.name}-online`"
            />
            <label
              :for="`${student.name}-online`"
              style="background: #f65058ff; color: #28334aff"
            >
              <span>온라인</span>
            </label>

            <input
              type="radio"
              :name="student.name"
              :id="`${student.name}-offline`"
            />
            <label
              :for="`${student.name}-offline`"
              style="background: #fbde44ff; color: #f65058ff"
            >
              <span>오프라인</span>
            </label>

            <input
              type="radio"
              :name="student.name"
              :id="`${student.name}-absence`"
            />
            <label
              :for="`${student.name}-absence`"
              style="background: #28334aff; color: #fbde44ff"
            >
              <span>결석</span>
            </label>
          </div>
        </div>

        <Button
          class="p-button-warning p-button-raised btn-block"
          label="제출하기"
          type="submit"
        />
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: "",
      selected: "",
      students: [
        { name: "학생1", birth: "95.12.13", check: "offline" },
        { name: "학생2", birth: "95.12.13", check: "offline" },
        { name: "학생3", birth: "95.12.13", check: "offline" },
        { name: "학생4", birth: "95.12.13", check: "offline" },
        { name: "학생5", birth: "95.12.13", check: "offline" },
        { name: "학생6", birth: "95.12.13", check: "offline" },
        { name: "학생7", birth: "95.12.13", check: "offline" },
        { name: "학생8", birth: "95.12.13", check: "offline" },
      ],
    };
  },
  methods: {
    dateDisabled(_ymd, date) {
      const sunday = date.getDay();
      return sunday !== 0;
    },
    onSubmit() {
      if (!this.selectedDate) {
        alert("날짜를 입력해주세요");
      } else {
        alert("제출되었습니다");
      }
    },
  },
};
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
  justify-content: space-evenly;
}
.student {
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0;
  border-radius: 3px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  background: #efefef95;
}
.student__attendance {
  display: flex;
}
input[type="radio"] {
  display: none;
  height: 0;
  width: 0;
}
input[type="radio"] ~ label {
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
  opacity: 0.5;
}
input[type="radio"]:checked + label {
  opacity: 1;
  animation: jelly 0.6s ease;
}
</style>
