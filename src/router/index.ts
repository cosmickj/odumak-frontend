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
    store.dispatch("account/fetchUserInfo");
    return next();
  };

/*
{
  beforeEnter: fetchUserInfo(),
  path: "/daily-attendance",
  name: "DailyAttendance",
  component: () => import("@/views/DailyAttendance/Layout.vue"),
    meta: { requiresAuth: true },
},
*/
const routes: Array<RouteRecordRaw> = [
  {
    path: "/account",
    name: "AccountView",
    component: () => import("@/views/account/AccountView.vue"),
    children: [
      {
        path: "/account/signup",
        name: "AccountSignup",
        component: () => import("@/views/account/AccountSignup.vue"),
      },
      {
        path: "/account/login",
        name: "AccountLogin",
        component: () => import("@/views/account/AccountLogin.vue"),
      },
    ],
  },
  {
    path: "/",
    name: "AppView",
    component: () => import("@/views/app/AppView.vue"),
    children: [
      {
        path: "",
        name: "AppHome",
        component: () => import("@/views/app/AppHome.vue"),
      },
      {
        path: "/user",
        name: "AppUser",
        component: () => import("@/views/app/AppUser.vue"),
      },
      {
        path: "/attendance/input",
        name: "AttendanceInput",
        component: () => import("@/views/app/AttendanceInput.vue"),
      },
      // {
      //   path: "/attendance/student/daily",
      //   name: "AttendanceStudentDaily",
      //   component: "",
      // },
      // {
      //   path: "/attendance/student/total",
      //   name: "AttendanceStudentTotal",
      //   component: "",
      // },
      // {
      //   path: "/attendance/teacher/daily",
      //   name: "AttendanceTeacherDaily",
      //   component: "",
      // },
      // {
      //   path: "/attendance/teacher/total",
      //   name: "AttendanceTeacherTotal",
      //   component: "",
      // },
    ],
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
