import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouteLocation,
  NavigationGuardNext,
} from "vue-router";
import { getUserState } from "@/firebase/config";
import store from "@/store";

const fetchUserInfo =
  () => (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
    store.dispatch("user/fetchUserInfo");
    return next();
  };

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
    beforeEnter: fetchUserInfo(),
    path: "/main",
    name: "MainPage",
    component: () => import("@/views/MainPage.vue"),
    // meta: { requiresAuth: true },
  },
  {
    beforeEnter: fetchUserInfo(),
    path: "/input",
    name: "InputAttendance",
    component: () => import("@/views/InputAttendance/Layout.vue"),
    // meta: { requiresAuth: true },
  },
  {
    beforeEnter: fetchUserInfo(),
    path: "/daily-attendance",
    name: "DailyAttendance",
    component: () => import("@/views/DailyAttendance/Layout.vue"),
    // meta: { requiresAuth: true },
  },
  {
    path: "/total-attendance",
    name: "TotalAttendance",
    component: () => import("@/views/TotalAttendance.vue"),
    // meta: { requiresAuth: true },
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
