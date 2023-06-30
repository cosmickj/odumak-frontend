import { defineStore } from 'pinia';

import { auth, db, usersColl } from '@/firebase/config';
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { deleteUser, signOut } from 'firebase/auth';

import { useMemberStore } from './member';
import { userConverter } from '@/utils/useConverter';
import { COLLECTION } from '@/constants/common';
import type { Member, User } from '@/models';
import type {
  CreateSingleParams,
  FetchSingleParams,
  FetchMultipleByChurchAndDepartment,
  ModifySingle,
} from '@/types/store';

interface UserStoreState {
  userData: User | null;
  isAuthReady: boolean;
  isVisible: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserStoreState => ({
    userData: null,
    isAuthReady: false,
    isVisible: false,
  }),
  actions: {
    async createSingle(params: CreateSingleParams) {
      try {
        const { uid, ...newUser } = params;

        await setDoc(doc(db, COLLECTION.USERS, uid), {
          ...newUser,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        throw Error((error as Error).message);
      }
    },

    async fetchSingle({ uid }: FetchSingleParams) {
      try {
        const ref = doc(db, COLLECTION.USERS, uid).withConverter(userConverter);
        const docSnap = await getDoc(ref);

        if (!docSnap.exists()) {
          return null;
        }

        let user = docSnap.data();

        if (!user.isAccepted) {
          user = mergeUserWithDefaultMemberData(user);
        } else {
          const memberStore = useMemberStore();
          const [member] = await memberStore.fetchByName({
            name: user.name,
            church: user.church,
            department: user.department,
          });
          user = mergeUserWithMemberData(user, member);
        }

        this.userData = setUserUID(user, uid);
        return this.userData;
      } catch (error) {
        throw Error((error as Error).message);
      }
    },
    /**
     * 관리자 페이지에서 가입자 전체 목록 읽어오기
     */
    async fetchMultipleByChurchAndDepartment(
      params: FetchMultipleByChurchAndDepartment
    ) {
      const { church, department } = params;

      const q = query(
        usersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('role', '!=', 'admin')
      );
      const qSnapshot = await getDocs(q);

      const result = qSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      return result as unknown as User[];
    },
    /**
     * 유저 정보 수정 함수 - 속성 1개
     */
    async modifySingle(params: ModifySingle) {
      const { uid, keyName, keyValue } = params;
      return await updateDoc(doc(db, COLLECTION.USERS, uid), {
        [keyName]: keyValue,
      });
    },
    /**
     * 유저 정보 수정 함수 - 속성 n개
     */
    async modifyMultiple(payload: any) {
      const { uid, ...params } = payload;
      return await updateDoc(doc(db, COLLECTION.USERS, uid), {
        ...params,
      });
    },

    async deleteSingle() {
      try {
        const { currentUser } = auth;

        if (currentUser) {
          await deleteUser(currentUser);
          await deleteDoc(doc(db, COLLECTION.USERS, currentUser.uid));
        }
      } catch (error) {
        throw Error((error as Error).message);
      }
    },

    async logout() {
      try {
        await signOut(auth);
        this.userData = null;
      } catch (error) {
        throw Error((error as Error).message);
      }
    },
  },
});

const mergeUserWithDefaultMemberData = (user: User): User => ({
  ...user,
  birth: null,
  birthLater: true,
  grade: '',
  group: '',
  isNewFriendClass: false,
  remark: '',
  job: 'teacher',
  role: { system: 'user', teacher: 'common' },
});

const mergeUserWithMemberData = (user: User, member: Member): User => {
  return { ...user, ...member };
};

const setUserUID = (user: User, uid: string) => {
  return { ...user, uid };
};
