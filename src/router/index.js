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

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   console.log(to, from);
//   next();
// });

export default router;
