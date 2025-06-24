// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthChange } from "../firebase";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userBadge, setUserBadge] = useState("Member");

  useEffect(() => {
    const unsubscribe = onAuthChange(async (u) => {
      setUser(u);
      setLoading(false);
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
          setUserBadge("Member");
        }
      } else {
        setUserBadge("Member");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, userBadge }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

