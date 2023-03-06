import { defineStore } from 'pinia';

import { db, usersColl } from '@/firebase/config';
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

import { Collection } from '@/enums';
import type { UserData } from '@/types';
import type {
  UserCreateSingleParams,
  UserDeleteSingleParams,
  UserFetchSingleParams,
  UserFetchMultipleByChurchAndDepartment,
  UserModifySingle,
} from '@/types/store';

export const useUserStore = defineStore('user', {
  actions: {
    /**
     * 회원가입 이후 유저 정보 생성 함수
     */
    async createSingle(params: UserCreateSingleParams) {
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
    /**
     * 로그인 이후 유저 정보 읽기 함수
     */
    async fetchSingle(params: UserFetchSingleParams) {
      try {
        const docRef = doc(db, Collection.USERS, params.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return docSnap.data() as UserData;
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
      params: UserFetchMultipleByChurchAndDepartment
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
    async modifySingle(params: UserModifySingle) {
      const { uid, keyName, keyValue } = params;
      return await updateDoc(doc(db, 'newUsers', uid), {
        [keyName]: keyValue,
      });
    },
    /**
     * 탈퇴 이후 유저 정보 삭제 함수
     */
    async deleteSingle(params: UserDeleteSingleParams) {
      try {
        await deleteDoc(doc(db, Collection.USERS, params.uid));
      } catch (error) {
        throw Error((error as Error).message);
      }
    },
  },
});
