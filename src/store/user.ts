import { defineStore } from 'pinia';

import { db } from '@/firebase/config';
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { Collection } from '@/enums';
import type { UserData } from '@/types';
import type {
  UserCreateSingleParams,
  UserDeleteSingleParams,
  UserFetchSingleParams,
} from '@/types/store';

export const useUserStore = defineStore('user', {
  actions: {
    /**
     * 회원가입 이후 유저 정보 생성 함수
     */
    async createSingle(params: UserCreateSingleParams) {
      try {
        const { uid, ...createSingleParams } = params;

        await setDoc(doc(db, Collection.USERS, uid), {
          ...createSingleParams,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 로그인 이후 유저 정보 읽기 함수
     */
    async fetchSingle(params: UserFetchSingleParams) {
      try {
        const docRef = doc(db, Collection.USERS, params.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // TODO: attendances를 모두 가져오면 무거워진다. 이걸 빼고 가져오자.
          return docSnap.data() as UserData;
        } else {
          return null;
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 탈퇴 이후 유저 정보 삭제 함수
     */
    async deleteSingle(params: UserDeleteSingleParams) {
      try {
        await deleteDoc(doc(db, Collection.USERS, params.uid));
      } catch (error) {
        console.log(error);
      }
    },
  },
});
