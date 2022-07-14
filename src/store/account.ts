import { auth, db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { defineStore } from 'pinia';
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
        const fetchAccountRes = await this.fetchAccount({ uid: loginAccountRes.user.uid });

        this.userData = {
          uid: loginAccountRes.user.uid,
          email: loginAccountRes.user.email!,
          name: loginAccountRes.user.displayName!,
          ...(fetchAccountRes as AccountData),
        };
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
  },
});
