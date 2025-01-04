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

router.beforeEach(async (to, _, next) => {
  const userStore = useUserStore();

  try {
    const firebaseUser = await getFirebaseUser();

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
    const requiresAccept = to.matched.some((record) => record.meta.requiresAccept);

    // 🔓 로그인하지 않았고, 인증이 필요 없는 페이지일 경우 바로 이동
    if (!firebaseUser && !requiresAuth) return next();

    // 🔒 로그인하지 않았고, 인증이 필요한 페이지일 경우 로그인 페이지로 리다이렉트
    if (!firebaseUser && requiresAuth) return next({ name: 'LoginView' });

    // 🔄 로그인한 상태에서 로그인 페이지로 이동 시 홈으로 리다이렉트
    if (firebaseUser && !requiresAuth) return next({ name: 'HomeView' });

    // 💾 사용자 데이터가 없을 경우 불러오기
    if (!userStore.userData) {
      await userStore.fetchSingle({ uid: firebaseUser.uid });
    }

    const { isAccepted } = userStore.userData!;

    // ✅ 조건 검사 시작

    // if (!isAccepted && !isApprovalRequested && !to.fullPath.startsWith('/waypoint')) {
    //   return next({ name: 'GroupCheck' });
    // }

    // ================================================================
    // XXX: 임시로 해둔 상태
    if (!isAccepted && !to.fullPath.startsWith('/pending')) {
      return next({ name: 'PendingView' });
    }
    // if (!isAccepted && isApprovalRequested && !to.fullPath.startsWith('/pending')) {
    //   return next({ name: 'PendingView' });
    // }
    // ================================================================

    // if (requiresAdmin && userStore.userData?.role.system !== 'admin') {
    //   return next({ name: 'HomeView' });
    // }

    // 🚀 모든 조건을 통과한 경우 페이지로 이동
    return next();
  } catch (error) {
    console.log(error);
  } finally {
    userStore.isAuthReady = true;
  }
});

// Router Auth Checker
export const getFirebaseUser = (): any => {
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
