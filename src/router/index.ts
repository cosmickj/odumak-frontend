import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from '@/store/user';

const routes: Array<RouteRecordRaw> = [
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
    path: '/callback/naver',
    name: 'CallbackNaver',
    component: () => import('@/views/Account/Login/LoginCallbackNaver.vue'),
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'HomeView',
        components: {
          default: () => import('@/views/Home/HomeContainer.vue'),
          GlobalNavbar: () => import('@/components/TheNavbar.vue'),
        },
      },
      {
        path: 'user',
        name: 'UserView',
        components: {
          default: () => import('@/views/User/index.vue'),
        },
      },
      {
        path: 'user/edit',
        name: 'UserEditView',
        components: {
          default: () => import('@/views/User/UserEdit.vue'),
        },
      },
      {
        path: 'attendance/tracker/:job/:type',
        name: 'AttendanceTracker',
        components: {
          default: () => import('@/views/Attendance/Tracker/index.vue'),
          GlobalNavbar: () => import('@/components/TheNavbar.vue'),
        },
      },
      {
        path: 'attendance/checker/',
        name: 'AttendanceChecker',
        component: () => import('@/views/Attendance/Checker/index.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/views/Admin/AdminContainer.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'students',
        name: 'AdminStudent',
        component: () => import('@/views/Admin/Student/AdminStudent.vue'),
      },
      {
        path: 'teachers',
        name: 'AdminTeacher',
        component: () => import('@/views/Admin/Teacher/AdminTeacher.vue'),
      },
      {
        path: 'users',
        name: 'AdminUser',
        component: () => import('@/views/Admin/User/AdminUser.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const currentUser = await getCurrentUser();
  const needAuth = to.matched.some((record) => record.meta.requiresAuth);
  const needAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if ((needAuth && currentUser) || (!needAuth && !currentUser)) {
    if (needAdmin) {
      const userStore = useUserStore();
      const userData = await userStore.fetchSingle({ uid: currentUser.uid });

      if (userData!.role !== 'admin') next('/');
      else next();
    } else {
      next();
    }
  } else if (!needAuth && currentUser) {
    next('/');
  } else {
    next('/account/login');
  }
});

// Router Auth Checker
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
