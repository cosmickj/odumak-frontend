import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { getUserState } from "@/firebase/config";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/main",
  },
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("@/views/LoginPage.vue"),
    meta: { requiresUnauth: true },
  },
  {
    path: "/signup",
    name: "SignupPage",
    component: () => import("@/views/SignupPage.vue"),
    meta: { requiresUnauth: true },
  },
  {
    path: "/main",
    name: "MainPage",
    component: () => import("@/views/MainPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/input-attendance",
    name: "InputAttendance",
    component: () => import("@/views/InputAttendance.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/daily-attendance",
    name: "DailyAttendance",
    component: () => import("@/views/DailyAttendance.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/total-attendance",
    name: "TotalAttendance",
    component: () => import("@/views/TotalAttendance.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresUnauth = to.matched.some(
    (record) => record.meta.requiresUnauth
  );

  const isAuth = await getUserState();

  if (requiresAuth && !isAuth) next("/login");
  else if (requiresUnauth && isAuth) next("/");
  else next();
});

export default router;