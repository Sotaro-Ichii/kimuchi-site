// src/pages/LandingPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logout } from "../firebase";

function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // 承認されていない状態とみなしてログアウト
      logout();
      alert("未承認のユーザーです。ログアウトしました。");
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-[#fff4e6] text-center px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-[#c92a2a] mb-6">
        Kimuchiへようこそ
      </h1>
      {/* ...申請案内などのLP内容 */}
    </div>
  );
}

export default LandingPage;



