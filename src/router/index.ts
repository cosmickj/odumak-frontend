import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/error',
    component: () => import('@/views/ErrorView.vue'),
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'HomeView',
        component: () => import('@/views/Home/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'user',
        name: 'UserView',
        component: () => import('@/views/User/index.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/account',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'AccountLogin',
        component: () => import('@/views/Account/Login/index.vue'),
      },
      {
        path: 'signup',
        name: 'AccountSignup',
        component: () => import('@/views/Account/Signup/index.vue'),
      },
    ],
  },
  {
    path: '/attendance',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'checker/',
        name: 'AttendanceChecker',
        component: () => import('@/views/Attendance/Checker/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'tracker/:position/:type',
        name: 'AttendanceTracker',
        component: () => import('@/views/Attendance/Tracker/index.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: ':position/table',
        name: 'AdminView',
        component: () => import('@/views/Admin/index.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.path !== '/error') {
    next('/error');
  } else {
    next();
  }
  // if (to.matched.some((record) => record.meta.requiresAuth)) {
  //   if (await getCurrentUser()) {
  //     next();
  //   } else {
  //     next('/account/login');
  //   }
  // } else {
  //   next();
  // }
});

// router auth checker
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

export default router;
