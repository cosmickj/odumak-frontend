import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("@/views/LoginPage"),
  },
  {
    path: "/main",
    name: "MainPage",
    component: () => import("@/views/MainPage"),
  },
  {
    path: "/daily-attendance",
    name: "DailyAttendance",
    component: () => import("@/views/DailyAttendance.vue"),
  },
  {
    path: "/total-attendance",
    name: "TotalAttendance",
    component: () => import("@/views/TotalAttendance.vue"),
  },
  {
    path: "/input-attendance",
    name: "InputAttendance",
    component: () => import("@/views/InputAttendance.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
