<template>
  <div id="input-attendance">
    <!-- 학생 출석 입력폼 -->
    <b-container fluid class="input-attendance__container mt-2">
      <b-form @submit="onSubmit">
        <div class="input-attendance-date d-flex p-3">
          <b-form-datepicker
            class="w-50"
            v-model="selectedDate"
            placeholder="날짜 선택"
            :date-disabled-fn="dateDisabled"
            :date-format-options="{
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
              weekday: 'narrow',
            }"
          ></b-form-datepicker>
          <div
            class="d-flex justify-content-center align-items-center flex-grow-1"
          >
            <span>3-1</span>
          </div>
          <div
            class="d-flex justify-content-center align-items-center flex-grow-1"
          >
            <span>이유빈</span>
          </div>
        </div>
        <b-row
          class="p-3 mx-2 my-1 border rounded shadow-sm"
          v-for="(student, index) in students"
          :key="index"
        >
          <!-- 학생 인적사항 -->
          <b-col cols="5" class="p-0">
            <label class="pb-1" for="remark">
              {{ student.name }} / {{ student.birth }}
            </label>
            <b-form-input
              id="remark"
              type="text"
              placeholder="비고"
            ></b-form-input>
          </b-col>
          <!-- 학생 출결입력 -->
          <b-col cols="7" class="p-0">
            <div class="d-flex justify-content-center align-items-center">
              <!-- 입력 버튼 -->
              <!-- <template v-for="(option, idx) in options">
                <input
                  type="radio"
                  :key="`input_${idx}`"
                  :id="`${student.name}_${idx}`"
                  :name="student.name"
                  :value="option.value"
                  v-model="student.check"
                />
                <label
                  :key="`label_${idx}`"
                  :for="`${student.name}_${idx}`"
                  :style="{
                    background: option.background,
                    color: option.color,
                  }"
                >
                  {{ option.text }}
                </label>
              </template> -->
            </div>
          </b-col>
        </b-row>

        <!-- NOTE: 입력 여부에 따라서 제출 혹은 수정 버튼 나타나게 하기 -->
        <div class="mx-2 my-4">
          <b-button
            class="btn-submit"
            type="submit"
            variant="warning"
            size="lg"
            block
          >
            제출하기
          </b-button>

          <b-button
            class="btn-submit"
            type="submit"
            variant="danger"
            size="lg"
            block
          >
            수정하기
          </b-button>
        </div>
      </b-form>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: "",
      selected: "",
      options: [
        {
          text: "미참여",
          value: "absence",
          background: "#f65058ff",
          color: "#28334aff",
        },
        {
          text: "온라인",
          value: "online",
          background: "#fbde44ff",
          color: "#f65058ff",
        },
        {
          text: "현장예배",
          value: "offline",
          background: "#28334aff",
          color: "#fbde44ff",
        },
      ],
      students: [
        { name: "학생1", birth: "95.12.13", check: "offline" },
        { name: "학생2", birth: "95.12.13", check: "offline" },
        { name: "학생3", birth: "95.12.13", check: "offline" },
        { name: "학생4", birth: "95.12.13", check: "offline" },
        { name: "학생5", birth: "95.12.13", check: "offline" },
      ],
    };
  },
  methods: {
    dateDisabled(_ymd, date) {
      const sunday = date.getDay();
      return sunday !== 0;
    },
    onSubmit(event) {
      event.preventDefault();
      alert("제출되었습니다");
    },
  },
};
</script>

<style scoped>
#input-attendance {
  height: 100vh;
  overflow: auto;
}
.input-attendance-date {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #0084b6;
}
.input-attendance__container {
  padding: 0 10px;
}
#remark {
  height: 28px;
  font-size: 12px;
}
input[type="radio"] {
  --visibility: hidden;
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
