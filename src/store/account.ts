import { Module } from "vuex";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db, usersCol } from "@/firebase/config";
import { doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { AccountState, RootState } from "@/store/types";
import baseResponse from "@/config/baseResponseStatus";
import { errResponse, response } from "@/config/response";
import teacherList from "@/data/teacher_list.json";

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
      try {
        const target = teacherList.filter((teacher) => teacher.name === payload.name);
        // 해당 이름을 가진 사람이 선생님으로 등록되어 있는가?
        if (target.length === 0) {
          return errResponse(baseResponse.NAME_UNKNOWN);
        }
        // 해당 이름으로 가입하려는 사람의 역할이 맞는가?
        if (payload.role !== target[0].role) {
          return errResponse(baseResponse.ROLE_UNMATCHED);
        }
        // 입력된 담당 학급 내용이 맞는가?
        if (payload.grade !== target[0].grade || payload.group !== target[0].group) {
          return errResponse(baseResponse.CLASS_UNMATCHED);
        }
        // 이미 해당 이름으로 가입되어 있는 회원이 있는가?
        const q = query(usersCol, where("name", "==", payload.name));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length === 1) {
          return errResponse(baseResponse.NAME_DUPLICATED);
        }

        const signupRes = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
        await updateProfile(signupRes.user, { displayName: payload.name });
        return response(baseResponse.SUCCESS, signupRes);
      } catch (error) {
        console.log(error); // TODO: firebase 자체에서 생기는 오류에 대한 것도 처리하자
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
