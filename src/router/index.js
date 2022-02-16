import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Daily Attendance",
    component: () => import("@/views/DailyAttendance.vue"),
  },
  {
    path: "/total-attendance",
    name: "Total Attendance",
    component: () => import("@/views/TotalAttendance.vue"),
  },
  {
    path: "/input-attendance",
    name: "Input Attendance",
    component: () => import("@/views/InputAttendance.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
