<template>
  <div>
    <div class="d-flex justify-content-center align-items-center date-wrapper">
      <span class="date">{{ selectedDate }}</span>
    </div>

    <div class="d-flex">
      <b-form-datepicker
        class="m-2"
        v-model="selectedDate"
        size="sm"
        placeholder="날짜 선택"
        :button-only="true"
      ></b-form-datepicker>
      <b-form-select
        class="m-2 attendance-select"
        v-model="selectedAttendanceType"
        :options="attendanceTypes"
        size="sm"
      ></b-form-select>
      <b-input-group class="m-2" size="sm">
        <b-input-group-prepend>
          <b-input-group-text>
            <i class="fas fa-search"></i>
          </b-input-group-text>
        </b-input-group-prepend>
        <b-form-input></b-form-input>
      </b-input-group>
    </div>

    <div class="name-card-wrapper" v-for="i in 15" :key="i">
      <div class="name-card-container">123</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: "",
      selectedAttendanceType: "online",
      attendanceTypes: [
        { value: "online", text: "온라인 예배" },
        { value: "offline", text: "현장 예배" },
        { value: "dabsence", text: "미참여" },
      ],
    };
  },
  created() {
    const today = new Date(+new Date() + 3240 * 10000)
      .toISOString()
      .split("T")[0];
    this.selectedDate = today;
  },
};
</script>

<style scoped>
.date-wrapper {
  margin-left: 8px;
  margin-right: 8px;
  margin-top: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px #dde1e5 solid;
  border-radius: 5px;
}
.date {
  font-weight: bold;
}
.name-card-wrapper {
  padding: 3px 8px 3px 8px;
  /* background: orange; */
}
.name-card-container {
  background: palegoldenrod;
  border-radius: 5px;
  height: 100px;
}
</style>
