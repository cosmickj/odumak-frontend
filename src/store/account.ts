import { defineStore } from 'pinia';
import { auth, db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
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
    async loginAccount({ email, password }: { email: string; password: string }) {
      try {
        const loginAccountRes = await signInWithEmailAndPassword(auth, email, password);
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

    // TODO: 회원가입 로직: 선생님 리스트를 파이어베이스에서 불러오기
    // async signup(context, payload) {
    //   try {
    //     const target = teacherList.filter((teacher) => teacher.name === payload.name);
    //     // 해당 이름을 가진 사람이 선생님으로 등록되어 있는가?
    //     if (target.length === 0) {
    //       return errResponse(baseResponse.NAME_UNKNOWN);
    //     }
    //     // 해당 이름으로 가입하려는 사람의 역할이 맞는가?
    //     if (payload.role !== target[0].role) {
    //       return errResponse(baseResponse.ROLE_UNMATCHED);
    //     }
    //     // 입력된 담당 학급 내용이 맞는가?
    //     if (payload.grade !== target[0].grade || payload.group !== target[0].group) {
    //       return errResponse(baseResponse.CLASS_UNMATCHED);
    //     }
    //     // 이미 해당 이름으로 가입되어 있는 회원이 있는가?
    //     const q = query(usersCol, where('name', '==', payload.name));
    //     const querySnapshot = await getDocs(q);
    //     if (querySnapshot.docs.length === 1) {
    //       return errResponse(baseResponse.NAME_DUPLICATED);
    //     }

    //     const signupRes = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
    //     await updateProfile(signupRes.user, { displayName: payload.name });
    //     return response(baseResponse.SUCCESS, signupRes);
    //   } catch (error) {
    //     console.log(error); // TODO: firebase 자체에서 생기는 오류에 대한 것도 처리하자
    //   }
    // },

    // async createUser(context, { uid, email, name, role, grade, group }) {
    //   try {
    //     await setDoc(doc(db, 'users', uid), {
    //       email,
    //       name,
    //       role,
    //       grade,
    //       group,
    //       createdAt: serverTimestamp(),
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    // async logout({ commit }) {
    //   await signOut(auth);
    //   commit('SET_USER', null);
    // },
  },
});
