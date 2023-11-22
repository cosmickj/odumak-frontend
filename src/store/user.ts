import { deleteUser, signOut } from 'firebase/auth';
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
import { defineStore } from 'pinia';
import type { MemberData } from '@/types';
import type { CreateSingleParams, FetchSingleParams, ModifySingle } from '@/types/store';
import { Member, User } from '@/models';
import { auth, db } from '@/firebase/config';
import { userConverter } from '@/utils/useConverter';
import { COLLECTION } from '@/constants/common';
import { useMemberStore } from './member';

interface UserStoreState {
  userData: User | null;
  isAuthReady: boolean;
  isAcceptDialogVisible: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserStoreState => ({
    userData: null,
    isAuthReady: false,
    isAcceptDialogVisible: false,
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

        if (user.isAccepted) {
          const memberStore = useMemberStore();
          const [member] = await memberStore.fetchByName({
            name: user.name,
            church: user.church,
            department: user.department,
          });

          // FIXME: 관리자 페이지에서 system 값도 넣을 수 있게하여 기존 데이터를 수정하자.
          if (!member.role.system) {
            member.role.system = 'user';
          }

          user = mergeUserWithMemberData(user, member);
        } else {
          const defaultParams: MemberData = {
            uid: user.uid,
            name: user.name,
            church: user.church,
            department: user.department,
            grade: '',
            group: '',
            job: 'teacher',
            role: { system: 'user', teacher: 'common' },
            gender: 'male',
            birth: null,
            birthLater: true,
            isNewFriendClass: false,
            remark: '',
            status: 'active',
          };
          user = mergeUserWithMemberData(user, new Member(defaultParams));
        }

        this.userData = setUserUID(user, uid);
        return this.userData;
      } catch (error) {
        throw Error((error as Error).message);
      }
    },

    // async fetchMultipleByChurchAndDepartment(params: FetchMultipleByChurchAndDepartment) {
    //   const { church, department } = params;
    //   const q = query(
    //     usersColl,
    //     where('church', '==', church),
    //     where('department', '==', department),
    //     where('role', '!=', 'admin')
    //   );
    //   const qSnapshot = await getDocs(q);
    //   const result = qSnapshot.docs.map((doc) => ({
    //     uid: doc.id,
    //     ...doc.data(),
    //   }));
    //   return result as unknown as User[];
    // },

    async modifySingle(params: ModifySingle) {
      const { uid, keyName, keyValue } = params;
      return await updateDoc(doc(db, COLLECTION.USERS, uid), {
        [keyName]: keyValue,
      });
    },

    async modifyMultiple(payload: ModifySingle) {
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

const mergeUserWithMemberData = (user: User, member: Member): User => {
  return { ...user, ...member };
};

const setUserUID = (user: User, uid: string) => {
  return { ...user, uid };
};
