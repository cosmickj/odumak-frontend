import baseResponse from '@/utils/baseResponseStatus';
import { errResponse, response } from '@/utils/response';

import { defineStore } from 'pinia';
import { useUserStore } from './user';

import { auth } from '@/firebase/config';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import {
  AccountData,
  AuthData,
  UserData,
  AccountLoginParams,
  AccountSignupParams,
} from '@/types/store';

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
        const userStore = useUserStore();

        const { email, password } = params;
        const { user: account } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const fetchUserRes = (await userStore.fetchSingle({
          uid: account.uid,
        })) as UserData;

        this.composeAccountData(account, fetchUserRes);
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
        this.accountData = null;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 탈퇴 하기
     */
    async delete() {
      try {
        const userStore = useUserStore();

        const account = auth.currentUser;
        if (account) {
          await deleteUser(account);
          await userStore.deleteSingle({ uid: account.uid });
        }
        this.accountData = null;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 계정 정보와 유저 정보를 합치기
     */
    composeAccountData(authData: AuthData, userData: UserData) {
      this.accountData = {
        uid: authData.uid,
        email: authData.email || '이메일이 존재하지 않습니다.',
        displayName: authData.displayName || '이름이 존재하지 않습니다.',
        ...userData,
      };
      this.isAuthReady = true;
    },
  },
});
