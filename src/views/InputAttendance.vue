<template>
  <div>
    <div class="d-flex p-2">
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
      <div class="d-flex justify-content-center align-items-center flex-grow-1">
        <span>3-1</span>
      </div>
      <div class="d-flex justify-content-center align-items-center flex-grow-1">
        <span>이유빈</span>
      </div>
    </div>

    <b-container class="p-0" fluid>
      <b-row
        class="p-3 mx-2 my-1 border rounded shadow-sm"
        v-for="(student, index) in students"
        :key="index"
      >
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
        <b-col cols="7" class="p-0">
          <div class="d-flex justify-content-center align-items-center">
            <!-- 입력 버튼 -->
            <template v-for="(option, idx) in options">
              <input
                type="radio"
                :key="'input' + idx"
                :name="student.name"
                :id="student.name + idx"
                :value="option.value"
                v-model="student.check"
              />
              <label
                :key="'label' + idx"
                :for="student.name + idx"
                :style="{ background: option.background, color: option.color }"
              >
                {{ option.text }}
              </label>
            </template>
          </div>
        </b-col>
      </b-row>
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
        { name: "학생1", birth: "95.12.13", check: "" },
        { name: "학생2", birth: "95.12.13", check: "" },
        { name: "학생3", birth: "95.12.13", check: "" },
        { name: "학생4", birth: "95.12.13", check: "" },
        { name: "학생5", birth: "95.12.13", check: "" },
      ],
    };
  },
  methods: {
    dateDisabled(_ymd, date) {
      const sunday = date.getDay();
      return sunday !== 0;
    },
  },
};
</script>

<style scoped>
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
