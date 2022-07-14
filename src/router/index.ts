import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const routes: Array<RouteRecordRaw> = [
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
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

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      alert('회원가입을 진행해주세요.');
      next('/account/login');
    }
  } else {
    next();
  }
});

export default router;
