import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useAccountStore } from '@/store/account';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
    children: [
      {
        path: 'checker/',
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
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
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
  const user = await getCurrentUser();
  const needAuth = to.matched.some((record) => record.meta.requiresAuth);
  const needAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if ((needAuth && user) || (!needAuth && !user)) {
    if (needAdmin) {
      const account = useAccountStore();
      const userData = await account.fetchAccount({ uid: user.uid });
      if (userData!.role !== 'admin') {
        next('/');
      } else {
        next();
      }
    } else {
      next();
    }
  } else if (!needAuth && user) {
    next('/');
  } else {
    next('/account/login');
  }
});

// router auth checker
export const getCurrentUser = (): any => {
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
