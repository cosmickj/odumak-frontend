<template>
  <div id="daily-attendance">
    <AttendanceSheet
      :items="dailyAttendaces"
      :fields="dailyAttendaceFields"
    ></AttendanceSheet>
  </div>
</template>

<script>
import AttendanceSheet from "../components/AttendanceSheet.vue";

export default {
  components: { AttendanceSheet },
  computed: {
    dailyAttendaces() {
      return this.$store.state.dailyAttendaces;
    },
    dailyAttendaceFields() {
      return this.$store.state.dailyAttendaceFields;
    },
  },
};
</script>

<style scoped>
/* BUTTON */
.button-wrapper {
  padding: 10px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.button-wrapper button {
  background-color: #1abc9c;
  border: 1px solid #1abc9c;
  display: block;
  width: 100%;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  /* box-shadow: 1px 1px 3px #333; */
}
.button-wrapper button:active {
  background-color: #1abc9c99;
  border: 1px solid #1abc9c99;
  color: #333;
}
.button-wrapper button a {
  text-decoration: none;
  color: #fff;
}
</style>
