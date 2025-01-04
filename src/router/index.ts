import { onAuthStateChanged } from 'firebase/auth';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/firebase/config';
import { useUserStore } from '@/store/user';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'HomeView',
        meta: { requiresAuth: true },
        components: {
          default: () => import('@/views/Home/HomeContainer.old.vue'),
          GlobalNavbar: () => import('@/components/TheNavbar.vue'),
        },
      },
      {
        path: 'login',
        name: 'LoginView',
        meta: { requiresAuth: false },
        component: () => import('@/views/Login/LoginContainer.vue'),
      },
      {
        path: 'login/callback',
        meta: { requiresAuth: false },
        component: () => import('@/views/Login/LoginCallback.vue'),
      },
      {
        path: 'user',
        name: 'UserView',
        meta: { requiresAuth: true },
        component: () => import('@/views/User/index.vue'),
      },
      {
        path: 'attendance/tracker',
        meta: { requiresAuth: true, requiresAccept: true },
        components: {
          default: () => import('@/views/Attendance/Tracker/index.vue'),
          GlobalNavbar: () => import('@/components/TheNavbar.vue'),
        },
        children: [
          {
            path: 'daily/student',
            name: 'AttendanceTrackerDailyStudent',
            component: () => import('@/views/Attendance/Tracker/_partials/TrackerDailyStudent.vue'),
          },
          {
            path: 'daily/teacher',
            name: 'AttendanceTrackerDailyTeacher',
            component: () => import('@/views/Attendance/Tracker/_partials/TrackerDailyTeacher.vue'),
          },
          {
            path: 'total/:job',
            name: 'AttendanceTrackerTotal',
            component: () => import('@/views/Attendance/Tracker/TrackerTotal.vue'),
          },
        ],
      },
      {
        path: 'attendance/checker',
        name: 'AttendanceChecker',
        meta: { requiresAuth: true, requiresAccept: true },
        component: () => import('@/views/Attendance/Checker/index.vue'),
      },
      {
        path: '/waypoint',
        meta: { requiresAuth: true },
        component: () => import('@/views/Waypoint/WaypointContainer.vue'),
        children: [
          {
            path: 'name',
            name: 'NameCheck',
            component: () => import('@/views/Waypoint/partials/WaypointNameCheck.vue'),
          },
          {
            path: 'group',
            name: 'GroupCheck',
            component: () => import('@/views/Waypoint/partials/WaypointGroupCheck.vue'),
          },
          {
            path: 'teacher',
            name: 'TeacherCheck',
            component: () => import('@/views/Waypoint/partials/WaypointTeacherCheck.vue'),
          },
          {
            path: 'member',
            name: 'MemberCheck',
            component: () => import('@/views/Waypoint/partials/WaypointMemberCheck.vue'),
          },
        ],
      },
      {
        path: '/pending',
        meta: { requiresAuth: true },
        name: 'PendingView',
        component: () => import('@/views/PendingView.vue'),
      },
    ],
  },
  {
    path: '/admin',
    meta: { requiresAuth: true, requiresAdmin: true },
    component: () => import('@/views/Admin/AdminContainer.vue'),
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
  const userStore = useUserStore();
  const currentUser = await getCurrentUser();

  try {
    const needAuth = to.matched.some((record) => record.meta.requiresAuth);
    const needAdmin = to.matched.some((record) => record.meta.requiresAdmin);
    const needAccept = to.matched.some((record) => record.meta.requiresAccept);

    if (!currentUser && needAuth) {
      return next({ name: 'LoginView' });
    }

    if (currentUser) {
      if (!userStore.userData) {
        await userStore.fetchSingle({ uid: currentUser.uid });
      }

      if (!needAuth) {
        return next({ name: 'HomeView' });
      }
      if (needAccept && !userStore.userData?.isAccepted) {
        userStore.$patch({ isAcceptDialogVisible: true });
        return next({ name: 'HomeView' });
      }
      if (needAdmin && userStore.userData?.role.system !== 'admin') {
        return next({ name: 'HomeView' });
      }
    }
    return next();
  } catch (error) {
    console.log(error);
  } finally {
    userStore.isAuthReady = true;
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
