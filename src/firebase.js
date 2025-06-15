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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Firebase 設定
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

// ✅ Googleログイン
const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Googleログイン失敗:", error);
    throw error;
  }
};

// ✅ 匿名ログイン（オプション）
const loginAnonymously = async () => {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error("匿名ログイン失敗:", error);
    throw error;
  }
};

// ✅ メールでログイン
const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("ログインエラー:", error);
    throw error;
  }
};

// ✅ メールで登録（registerWithEmail を LandingPage 用に別名で）
const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("登録エラー:", error);
    throw error;
  }
};

// ✅ ログアウト
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("ログアウト失敗:", error);
    throw error;
  }
};

// ✅ 認証状態変化の監視
const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// ✅ エクスポート
export {
  auth,
  db,
  analytics,
  loginWithGoogle,
  loginAnonymously,
  logout,
  onAuthChange,
  loginWithEmail,
  registerWithEmail, // ← これが追加されたことで Vercel エラー解決！
};
