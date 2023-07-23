import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store/user';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// prettier-ignore
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
          default: () => import('@/views/Home/HomeContainer.vue'),
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
      // {
      //   path: 'user/edit',
      //   name: 'UserEditView',
      //   meta: { requiresAccept: true },
      //   component: () => import('@/views/User/UserEdit.vue'),
      // },
      {
        path: 'attendance/tracker',
        meta: { requiresAuth: true, requiresAccept: true },
        components: {
          default: () => import('@/views/Attendance/Tracker/index.vue'),
          GlobalNavbar: () => import('@/components/TheNavbar.vue'),
        },
        children: [
          {
            path: '/:job/daily',
            name: 'AttendanceTrackerDaily',
            component: () => import('@/views/Attendance/Tracker/TrackerDaily.vue'),
          },
          {
            path: '/:job/total',
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
        beforeEnter: () => {
          const { userData } = useUserStore();

          if (userData?.isAccepted) {
            return { name: 'HomeView' };
          }
        },
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
  const currentUser = await getCurrentUser();

  const needAuth = to.matched.some((record) => record.meta.requiresAuth);
  const needAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const needAccept = to.matched.some((record) => record.meta.requiresAccept);

  if (!currentUser && needAuth) {
    return next({ name: 'LoginView' });
  }

  if (currentUser) {
    const userStore = useUserStore();
    const user = await userStore.fetchSingle({ uid: currentUser.uid });

    if (!needAuth) {
      return next({ name: 'HomeView' });
    }
    if (needAccept && !user?.isAccepted) {
      userStore.$patch({ isAcceptDialogVisible: true });
      return next({ name: 'HomeView' });
    }
    if (needAdmin && user?.role.system !== 'admin') {
      return next({ name: 'HomeView' });
    }
  }

  return next();
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
