<template>
  <div>
    <AttendanceSheet :items="items" :fields="fields"></AttendanceSheet>

    <div class="button-wrapper">
      <button @click="filpShow">
        <router-link to="/total-attendance">누적 출석현황 보기</router-link>
      </button>
    </div>
  </div>
</template>

<script>
import AttendanceSheet from "../components/AttendanceSheet.vue";

export default {
  components: { AttendanceSheet },
  methods: {
    filpShow() {
      // this.show = !this.show;
      // NOTE: 누적 합계 계산 함수
      // const result = {};
      // for (let item of this.items) {
      //   if (!(item.class in result)) {
      //     result[item.class] = { online: 0, offline: 0 };
      //     if (item.attendance === "온라인") result[item.class].online++;
      //     else result[item.class].offline++;
      //   } else {
      //     if (item.attendance === "온라인") result[item.class].online++;
      //     else result[item.class].offline++;
      //   }
      // }
      // for (const [key, value] of Object.entries(result)) {
      //   // console.log(key, Object.values(value));
      //   const reducer = (accumulator, curr) => accumulator + curr;
      //   const total = Object.values(value).reduce(reducer);
      //   result[key]["total"] = total;
      // }
      // console.log(result);
    },
  },
  computed: {
    items() {
      return this.$store.state.items;
    },
    fields() {
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
