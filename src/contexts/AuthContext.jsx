// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthChange, auth } from "../firebase";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userBadge, setUserBadge] = useState("Member");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 初期化時に現在の認証状態を確認
    const initializeAuth = async () => {
      try {
        // 現在のユーザー状態を取得
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser(currentUser);
          // バッジ情報を取得
          try {
            const badgeDoc = await getDoc(doc(db, "userBadges", currentUser.uid));
            if (badgeDoc.exists()) {
              setUserBadge(badgeDoc.data().badge || "Member");
            } else {
              setUserBadge("Member");
            }
          } catch (e) {
            console.error("バッジ情報取得エラー:", e);
            setUserBadge("Member");
          }
        }
      } catch (error) {
        console.error("認証初期化エラー:", error);
      } finally {
        setInitialized(true);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const unsubscribe = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        // Firestoreからバッジ情報を取得
        try {
          const badgeDoc = await getDoc(doc(db, "userBadges", u.uid));
          if (badgeDoc.exists()) {
            setUserBadge(badgeDoc.data().badge || "Member");
          } else {
            setUserBadge("Member");
          }
        } catch (e) {
          console.error("バッジ情報取得エラー:", e);
          setUserBadge("Member");
        }
      } else {
        setUserBadge("Member");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [initialized]);

  return (
    <AuthContext.Provider value={{ user, loading, userBadge, initialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

