import { defineStore } from 'pinia';
import baseResponse from '@/utils/baseResponseStatus';
import { errResponse, response } from '@/utils/response';

import { auth, db } from '@/firebase/config';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { Collection } from '@/enums';
import {
  AccountData,
  AccountCreateUserParams,
  AccountSignupParams,
  AccountLoginParams,
  AccountFetchUserParams,
  UserData,
} from '@/types/store';

interface AccountStoreState {
  isAuthReady: boolean;
  userData: UserData | null;
}

export const useAccountStore = defineStore('account', {
  state: (): AccountStoreState => ({
    isAuthReady: false,
    userData: null,
  }),
  actions: {
    /**
     * 회원가입
     */
    async signup(params: AccountSignupParams) {
      try {
        const signupRes = await createUserWithEmailAndPassword(
          auth,
          params.email,
          params.password
        );
        await updateProfile(signupRes.user, {
          displayName: params.name,
        });
        return response(baseResponse.SUCCESS, signupRes);
      } catch (err) {
        return errResponse(baseResponse.NETWORK_ERROR);
      }
    },
    /**
     * 로그인
     */
    async login(params: AccountLoginParams) {
      try {
        const { email, password } = params;
        const loginAccountRes = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const fetchAccountRes = (await this.fetchUser({
          uid: loginAccountRes.user.uid,
        })) as AccountData;
        // 받아온 Auth 데이터와 User 데이터를 합쳐준다.
        this.userData = {
          uid: loginAccountRes.user.uid,
          email: loginAccountRes.user.email || '이메일이 존재하지 않습니다.',
          name: loginAccountRes.user.displayName || '이름이 존재하지 않습니다.',
          ...fetchAccountRes,
        };
        this.isAuthReady = true;
      } catch (error) {
        throw new Error('could not complete login');
      }
    },
    /**
     * 로그아웃
     */
    async logout() {
      try {
        await signOut(auth);
        this.userData = null;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 회원가입 이후 유저 정보 생성 함수
     */
    async createUser(params: AccountCreateUserParams) {
      try {
        const { uid, ...setDocParams } = params;
        await setDoc(doc(db, Collection.USERS, uid), {
          ...setDocParams,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 로그인 이후 유저 정보 읽기 함수
     */
    async fetchUser(params: AccountFetchUserParams) {
      try {
        const docRef = doc(db, Collection.USERS, params.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          return null;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
