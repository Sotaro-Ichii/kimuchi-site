// Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// 🔐 認証関連のインポート
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Firebase 設定
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

// Firestore
export const db = getFirestore(app);

// 🔐 認証機能のセットアップ
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginAnonymously = () => signInAnonymously(auth);
export const logout = () => signOut(auth);
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

