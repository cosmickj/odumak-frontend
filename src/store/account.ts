import baseResponse from '@/utils/baseResponseStatus';
import { errResponse, response } from '@/utils/response';

import { defineStore } from 'pinia';
import { useUserStore } from '@/store/user';

import { auth } from '@/firebase/config';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import type { AccountData, AuthData, UserData } from '@/types';
import type { AccountLoginParams, AccountSignupParams } from '@/types/store';

interface AccountStoreState {
  isAuthReady: boolean;
  accountData: AccountData | null;
}

export const useAccountStore = defineStore('account', {
  state: (): AccountStoreState => ({
    isAuthReady: false,
    accountData: null,
  }),
  actions: {
    /**
     * 회원가입
     */
    async signup(params: AccountSignupParams) {
      try {
        const signupResponse = await createUserWithEmailAndPassword(
          auth,
          params.email,
          params.password
        );
        await updateProfile(signupResponse.user, { displayName: params.name });
        return response(baseResponse.SUCCESS, signupResponse);
      } catch (err) {
        return errResponse(baseResponse.NETWORK_ERROR);
      }
    },
    /**
     * 로그인
     */
    async login(params: AccountLoginParams) {
      try {
        const userStore = useUserStore();

        const { user: authData } = await signInWithEmailAndPassword(
          auth,
          params.email,
          params.password
        );

        const fetchSingleResponse = await userStore.fetchSingle({
          uid: authData.uid,
        });

        if (fetchSingleResponse) {
          this.composeAccountData(authData, fetchSingleResponse);
        } else {
          throw Error('로그인 과정에서 오류가 발생하였습니다.');
        }
      } catch (error) {
        throw Error((error as Error).message);
      }
    },
    /**
     * 로그아웃
     */
    async logout() {
      try {
        await signOut(auth);
        this.accountData = null;
      } catch (error) {
        throw Error((error as Error).message);
      }
    },
    /**
     * 탈퇴 하기
     */
    async delete() {
      try {
        const { currentUser } = auth;

        if (currentUser) {
          await deleteUser(currentUser);

          const userStore = useUserStore();
          await userStore.deleteSingle({
            uid: currentUser.uid,
          });
        }

        this.accountData = null;
      } catch (error) {
        throw Error((error as Error).message);
      }
    },
    /**
     * 계정 정보와 유저 정보를 합치기
     */
    composeAccountData(authData: AuthData, userData: UserData) {
      this.accountData = {
        email: authData.email || '이메일이 존재하지 않습니다.',
        displayName: authData.displayName || '이름이 존재하지 않습니다.',
        ...userData,
      };
      this.isAuthReady = true;
    },
  },
});
