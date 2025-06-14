// firebase.js

// Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// 認証関連のインポート
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Firebase 設定情報
const firebaseConfig = {
  apiKey: "AIzaSyB99CXoH-GoRB2gQvH1Li-eCmK-aPuQ5c4",
  authDomain: "kimuchi-47d24.firebaseapp.com",
  projectId: "kimuchi-47d24",
  storageBucket: "kimuchi-47d24.firebasestorage.app",
  messagingSenderId: "200656033227",
  appId: "1:200656033227:web:2636da591f1efb3ba9124e",
  measurementId: "G-QW410GGPL9",
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// 認証プロバイダ（Google）
const googleProvider = new GoogleAuthProvider();

// --- 🔐 認証関数たち ---

// Googleログイン
const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Googleログインに失敗しました:", error);
    throw error;
  }
};

// 匿名ログイン（オプション）
const loginAnonymously = async () => {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error("匿名ログインに失敗しました:", error);
    throw error;
  }
};

// ログアウト
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("ログアウトに失敗しました:", error);
    throw error;
  }
};

// ユーザー状態監視
const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// --- ✅ export ---
export {
  auth,
  db,
  analytics,
  loginWithGoogle,
  loginAnonymously,
  logout,
  onAuthChange,
};
