import { createStore } from "vuex";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
// Modules
import { account } from "./account";
import { attendance } from "./attendance";

const store = createStore({
  modules: {
    account,
    attendance,
  },
});

// Waiting for Auth to be Ready
const unsub = onAuthStateChanged(auth, async (user) => {
  if (user) {
    const fetchUserResult = await store.dispatch(
      "account/fetchUser",
      user?.uid
    );
    store.commit("account/SET_USER", {
      name: user?.displayName,
      email: user?.email,
      uid: user?.uid,
      ...fetchUserResult,
    });
    store.commit("account/SET_AUTH_IS_READY", true);
  }
  unsub();
});

export default store;
