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

import { Collection } from '@/enums';
import type {
  CreateSingleParams,
  FetchSingleParams,
  FetchMultipleByChurchAndDepartment,
  ModifySingle,
} from '@/types/store';
import type { UserData } from '@/types';

interface UserStoreState {
  userData: UserData | null;
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

        await setDoc(doc(db, Collection.USERS, uid), {
          ...newUser,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        throw Error((error as Error).message);
      }
    },

    async fetchSingle(params: FetchSingleParams) {
      try {
        const docRef = doc(db, Collection.USERS, params.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.userData = {
            ...(docSnap.data() as UserData),
            uid: params.uid,
          };
          return this.userData;
        }
        return null;
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

      return result as unknown as UserData[];
    },
    /**
     * 유저 정보 수정 함수 - 속성 1개
     */
    async modifySingle(params: ModifySingle) {
      const { uid, keyName, keyValue } = params;
      return await updateDoc(doc(db, 'users', uid), {
        [keyName]: keyValue,
      });
    },
    /**
     * 유저 정보 수정 함수 - 속성 n개
     */
    async modifyMultiple(payload: any) {
      const { uid, ...params } = payload;
      return await updateDoc(doc(db, 'users', uid), {
        ...params,
      });
    },

    async deleteSingle() {
      try {
        const { currentUser } = auth;

        if (currentUser) {
          await deleteUser(currentUser);
          await deleteDoc(doc(db, Collection.USERS, currentUser.uid));
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
