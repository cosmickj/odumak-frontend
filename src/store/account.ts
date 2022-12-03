import { defineStore } from 'pinia';
import baseResponse from '@/utils/baseResponseStatus';
import { errResponse, response } from '@/utils/response';

import { auth, db } from '@/firebase/config';
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { Collection } from '@/enums';
import {
  AccountData,
  AccountCreateUserParams,
  AccountDeleteUserParams,
  AccountFetchUserParams,
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
        const { email, password } = params;
        const { user: account } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const fetchUserRes = (await this.fetchUser({
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
        const account = auth.currentUser;
        if (account) {
          await deleteUser(account);
          await this.deleteUser({ uid: account.uid });
        }
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
    async deleteUser(params: AccountDeleteUserParams) {
      try {
        await deleteDoc(doc(db, Collection.USERS, params.uid));
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 계정 정보와 유저 정보를 합치기
     */
    composeUserData(_a: AccountData, _u: UserData) {
      this.userData = {
        uid: _a.uid,
        email: _a.email || '이메일이 존재하지 않습니다.',
        displayName: _a.displayName || '이름이 존재하지 않습니다.',
        ..._u,
      };
      this.isAuthReady = true;
    },
  },
});
