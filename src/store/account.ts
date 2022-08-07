import { defineStore } from 'pinia';
import { useAttendanceStore } from './attendance';
import { auth, db, usersColl } from '@/firebase/config';
import {
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import baseResponse from '@/utils/baseResponseStatus';
import { errResponse, response } from '@/utils/response';
import { fetchTeachers } from '@/api/members';
import type { Teacher } from '@/types';
import type { AccountData, UserData } from '@/types/store';

interface AccountState {
  userData: UserData | null;
  isAuthReady: boolean;
}

export const useAccountStore = defineStore('account', {
  state: (): AccountState => {
    return {
      userData: null,
      isAuthReady: false,
    };
  },

  actions: {
    async loginAccount({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) {
      try {
        const loginAccountRes = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const fetchAccountRes = await this.fetchAccount({
          uid: loginAccountRes.user.uid,
        });
        this.userData = {
          uid: loginAccountRes.user.uid,
          email: loginAccountRes.user.email!,
          name: loginAccountRes.user.displayName!,
          ...(fetchAccountRes as AccountData),
        };
        this.isAuthReady = true;
      } catch (error) {
        throw new Error('could not complete login');
      }
    },
    async fetchAccount({ uid }: { uid: string }) {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) return docSnap.data();
      else console.log('No such document!');
    },
    async logoutAccount() {
      await signOut(auth);
      this.userData = null;
    },

    async signup(payload: any) {
      const attendance = useAttendanceStore();
      const result = await fetchTeachers();
      // const result = await attendance.fetchTeacherList();
      const teacherList = result.data;

      try {
        const target = teacherList.filter(
          (teacher: Teacher) => teacher.name === payload.name
        );
        // 해당 이름을 가진 사람이 선생님으로 등록되어 있는가?
        if (target.length === 0) {
          return errResponse(baseResponse.NAME_UNKNOWN);
        }
        // 해당 이름으로 가입하려는 사람의 역할이 맞는가?
        if (target[0].role !== payload.role) {
          return errResponse(baseResponse.ROLE_UNMATCHED);
        }
        // 입력된 담당 학급 내용이 맞는가?
        if (
          target[0].grade !== payload.grade ||
          target[0].group !== payload.group
        ) {
          return errResponse(baseResponse.CLASS_UNMATCHED);
        }
        // 이미 해당 이름으로 가입되어 있는 회원이 있는가?
        const q = query(usersColl, where('name', '==', payload.name));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length === 1) {
          return errResponse(baseResponse.NAME_DUPLICATED);
        }

        const signupRes = await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );
        await updateProfile(signupRes.user, { displayName: payload.name });
        return response(baseResponse.SUCCESS, signupRes);
      } catch (err) {
        // if (err instanceof Error) {
        //   return err.message;
        // }
        console.log(err);
      }
    },

    async createUser(payload: any) {
      try {
        await setDoc(doc(db, 'users', payload.uid), {
          church: payload.church,
          department: payload.department,
          email: payload.email,
          name: payload.name,
          role: payload.role,
          grade: payload.grade,
          group: payload.group,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
