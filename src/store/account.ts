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
  AccountLoginParams,
  AccountSignupParams,
  UserData,
} from '@/types/store';

// TODO: OdumakData로 추후에 변경하자
export interface _UserData extends AccountData, UserData {}

interface AccountStoreState {
  isAuthReady: boolean;
  userData: _UserData | null;
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

        this.composeUserData(account, fetchUserRes);
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
        this.userData = null;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 계정 정보와 유저 정보를 합치기
     */
    composeUserData(accountData: AccountData, userData: UserData) {
      this.userData = {
        uid: accountData.uid,
        email: accountData.email || '이메일이 존재하지 않습니다.',
        displayName: accountData.displayName || '이름이 존재하지 않습니다.',
        ...userData,
      };
      this.isAuthReady = true;
    },
  },
});
