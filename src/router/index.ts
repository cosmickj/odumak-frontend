import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { getUserState } from "@/firebase/config";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/account",
    redirect: "/account/login",
    name: "AccountView",
    component: () => import("@/views/account/AccountView.vue"),
    children: [
      {
        path: "/account/login",
        name: "AccountLogin",
        component: () => import("@/views/account/AccountLogin.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "/account/signup",
        name: "AccountSignup",
        component: () => import("@/views/account/AccountSignup.vue"),
        meta: { requiresAuth: false },
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
        meta: { requiresAuth: true },
      },
      {
        path: "/user",
        name: "AppUser",
        component: () => import("@/views/app/AppUser.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/attendance/input",
        name: "AttendanceInput",
        component: () => import("@/views/app/AttendanceInput.vue"),
        meta: { requiresAuth: true },
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
  const isAuth = await getUserState();
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !isAuth) next({ name: "AccountLogin" });
  else if (!requiresAuth && isAuth) next({ name: "AppHome" });
  else next();
});

export default router;
