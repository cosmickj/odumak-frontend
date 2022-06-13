import { auth, db, teachersCol } from "@/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { Module } from "vuex";
import { AccountState, RootState } from "@/store/types";

export const account: Module<AccountState, RootState> = {
  namespaced: true,

  state: () => ({
    user: null,
    authIsReady: false,
  }),

  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_AUTH_IS_READY(state, payload) {
      state.authIsReady = payload;
    },
  },

  actions: {
    async signup(context, payload) {
      console.log(payload);
      try {
        // #001 해당 이름을 가진 사람이 선생님으로 등록되어 있는가?
        const q = query(teachersCol, where("name", "==", payload.name));
        const response = await getDocs(q);

        if (response.docs.length < 1) {
          return {
            message: "등록되지 않은 이름입니다. 이름을 한 번 더 확인해주시거나 관리자에게 문의해주세요.",
          };
        }

        // #002 해당 이름으로 가입하려는 사람의 역할이 선생님이 맞는가?
        const registeredRole = response.docs[0].data().role;
        if (payload.role !== registeredRole) {
          return {
            message: "등록된 담임 선생님이 아닙니다. 관리자에게 문의해주세요.",
          };
        }

        // #003 입력된 담당 학급 내용이 맞는가?
        const registeredGrade = response.docs[0].data().grade;
        const registeredGroup = response.docs[0].data().group;
        if (payload.grade !== registeredGrade || payload.group !== registeredGroup) {
          return {
            message: "입력하신 학년과 반을 다시 확인해주세요.",
          };
        }

        // const signupResponse = await createUserWithEmailAndPassword(auth, email, password);

        // await updateProfile(signupResponse.user, { displayName: name });

        // return signupResponse;
      } catch (error) {
        console.log(error);
      }
    },

    async createUser(context, { uid, email, name, role, grade, group }) {
      try {
        await setDoc(doc(db, "users", uid), {
          email,
          name,
          role,
          grade,
          group,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    },

    async login({ commit, dispatch }, { email, password }) {
      try {
        const loginResponse = await signInWithEmailAndPassword(auth, email, password);
        const fetchUserResponse = await dispatch("fetchUser", loginResponse.user.uid);

        commit("SET_USER", {
          name: loginResponse.user.displayName,
          email: loginResponse.user.email,
          uid: loginResponse.user.uid,
          ...fetchUserResponse,
        });
      } catch (error) {
        throw new Error("could not complete login");
      }
    },

    async fetchUser(context, uid) {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
      }
    },

    async logout({ commit }) {
      await signOut(auth);
      commit("SET_USER", null);
    },
  },
};
