// ✅ 完成版 firebase.js

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

const firebaseConfig = {
  apiKey: "AIzaSyB99CXoH-GoRB2gQvH1Li-eCmK-aPuQ5c4",
  authDomain: "kimuchi-47d24.firebaseapp.com",
  projectId: "kimuchi-47d24",
  storageBucket: "kimuchi-47d24.appspot.com",
  messagingSenderId: "200656033227",
  appId: "1:200656033227:web:2636da591f1efb3ba9124e",
  measurementId: "G-QW410GGPL9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();

const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Googleログイン失敗:", error);
    throw error;
  }
};

const loginAnonymously = async () => {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error("匿名ログイン失敗:", error);
    throw error;
  }
};

const loginWithEmail = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Emailログイン失敗:", error);
    throw error;
  }
};

const registerWithEmail = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Email登録失敗:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("ログアウト失敗:", error);
    throw error;
  }
};

const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

export {
  auth,
  db,
  analytics,
  loginWithGoogle,
  loginAnonymously,
  loginWithEmail,
  registerWithEmail,
  logout,
  onAuthChange,
};
