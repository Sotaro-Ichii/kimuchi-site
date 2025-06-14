// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyB99CXoH-GoRB2gQvH1Li-eCmK-aPuQ5c4",
  authDomain: "kimuchi-47d24.firebaseapp.com",
  projectId: "kimuchi-47d24",
  storageBucket: "kimuchi-47d24.appspot.com",
  messagingSenderId: "200656033227",
  appId: "1:200656033227:web:2636da591f1efb3ba9124e",
  measurementId: "G-QW410GGPL9",
};

// 初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();

// ログイン関数
const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Googleログイン失敗:", error);
    throw error;
  }
};

// 匿名ログイン（未使用でもOK）
const loginAnonymously = async () => {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error("匿名ログイン失敗:", error);
    throw error;
  }
};

// ログアウト関数
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("ログアウト失敗:", error);
    throw error;
  }
};

// 認証状態変化の監視
const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// エクスポート
export {
  auth,
  db,
  analytics,
  loginWithGoogle,
  loginAnonymously,
  logout,
  onAuthChange,
};

