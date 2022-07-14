import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'HomeView',
        component: () => import('@/views/Home/index.vue'),
      },
      {
        path: 'user',
        name: 'UserView',
        component: () => import('@/views/User/index.vue'),
      },
    ],
  },
  {
    path: '/account',
    component: () => import('@/layouts/AccountLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'AccountLogin',
        component: () => import('@/views/Account/Login/index.vue'),
        // meta: { requiresAuth: false },
      },
      {
        path: 'signup',
        name: 'AccountSignup',
        component: () => import('@/views/Account/Signup/index.vue'),
        // meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: '/attendance',
    component: () => import('@/layouts/AttendanceLayout.vue'),
    children: [
      {
        path: 'checker/:position',
        name: 'AttendanceChecker',
        component: () => import('@/views/Attendance/Checker/index.vue'),
      },
      {
        path: 'tracker/:position/:type',
        name: 'AttendanceTracker',
        component: () => import('@/views/Attendance/Tracker/index.vue'),
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
