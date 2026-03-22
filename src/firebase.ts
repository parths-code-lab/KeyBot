import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjW05JrQQ5QBV2Zd4XcRWG_P6kXesvq9s",
  authDomain: "keybot-auth-74b2e.firebaseapp.com",
  projectId: "keybot-auth-74b2e",
  storageBucket: "keybot-auth-74b2e.firebasestorage.app",
  messagingSenderId: "280745555116",
  appId: "1:280745555116:web:4667b77746338701441b09"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);