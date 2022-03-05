import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("@/views/LoginPage.vue"),
  },
  {
    path: "/signup",
    name: "SignupPage",
    component: () => import("@/views/SignupPage.vue"),
  },
  {
    path: "/main",
    name: "MainPage",
    component: () => import("@/views/MainPage.vue"),
  },
  {
    path: "/input-attendance",
    name: "InputAttendance",
    component: () => import("@/views/InputAttendance.vue"),
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
