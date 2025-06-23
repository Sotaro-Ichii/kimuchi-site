// ✅ 完成版 LandingPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logout,
  db,
} from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaCheckCircle, FaUserShield, FaMoneyCheckAlt, FaLock, FaGoogle } from 'react-icons/fa';

function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const checkApproval = async () => {
      if (!loading && user) {
        try {
          const ref = doc(db, "approvedUsers", user.email);
          const snap = await getDoc(ref);
          if (snap.exists() && snap.data().status === "approved") {
            navigate("/home");
          } else {
            await logout();
            alert("まだ承認されていません。Zelle送金と申請が完了しているかご確認ください。");
          }
        } catch (error) {
          console.error("Firestore読み取りエラー:", error);
          alert("認証中にエラーが発生しました。");
        }
      }
    };
    checkApproval();
  }, [user, loading]);

  const handleEmailAuth = async () => {
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (error) {
      alert("ログイン/登録エラー: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18181b] via-[#232326] to-[#18181b] flex flex-col items-center justify-center px-4 py-8">
      {/* ヒーローセクション */}
      <section className="w-full max-w-2xl flex flex-col items-center justify-center text-center mb-12 mx-auto">
        <img src="/logo.png" alt="Kimuchi logo" className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg border-4 border-[#fbbf24] bg-[#18181b] mb-6" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#fbbf24] drop-shadow mb-4 tracking-tight">Kimuchi</h1>
        <p className="text-xl md:text-2xl text-[#e4e4e7] mb-8 font-light leading-relaxed max-w-xl mx-auto text-center">
          とある大学の、完全非公開の授業評価コミュニティ。<br />
          GPAと時間を守る、選ばれた人だけの楽単情報プラットフォーム。
        </p>
        <a
          href="#apply"
          className="inline-block bg-gradient-to-r from-[#fbbf24] to-[#f59e42] text-[#18181b] rounded-full px-8 py-4 text-xl font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-200 mb-2 text-center"
        >
          まずは申請する
        </a>
      </section>

      {/* ご利用条件カード */}
      <section id="apply" className="w-full max-w-xl bg-[#232326] rounded-2xl shadow-xl border border-[#27272a] p-8 mb-10 animate-fade-in">
        <h2 className="text-2xl font-bold text-[#2f9e44] flex items-center gap-2 mb-4">
          <FaUserShield className="inline text-[#2f9e44]" /> ご利用条件
        </h2>
        <ul className="text-left text-[#e4e4e7] space-y-3 mb-6">
          <li className="flex items-center gap-2"><FaCheckCircle className="text-[#22d3ee]" /> 承認制（GoogleまたはEmailログイン＋申請必須）</li>
          <li className="flex items-center gap-2"><FaMoneyCheckAlt className="text-[#fbbf24]" /> Zelleで一括支払い（$49.9 / 3ヶ月）</li>
          <li className="flex items-center gap-2"><FaLock className="text-[#c92a2a]" /> ログイン情報・内容の外部共有は<strong>厳禁</strong></li>
        </ul>
        <div className="bg-[#18181b] rounded-xl p-4 mb-4 border border-[#27272a]">
          <h3 className="text-lg font-semibold text-[#fbbf24] mb-2">ご利用までの流れ</h3>
          <ol className="list-decimal pl-6 text-[#e4e4e7] space-y-1 text-left">
            <li>Zelleで <strong>$49.9</strong> を一括zell送金（<strong>送金先電話番号:</strong> 657-709-1289）</li>
            <li>以下の申請フォームに必要事項を記入</li>
            <li>審査後、24時間以内に結果をご連絡します</li>
          </ol>
        </div>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeiKGlblgkAzjJmbVEno3L5lwWPiVt6ECZgt0OV9Ps6r6SRmw/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-gradient-to-r from-[#2f9e44] to-[#22d3ee] text-white rounded-full px-6 py-3 text-lg font-bold hover:scale-105 hover:shadow-2xl transition-transform duration-200 shadow"
        >
          申請フォームはこちら
        </a>
      </section>

      {/* ログイン・登録フォーム */}
      <section className="w-full max-w-md bg-[#232326] rounded-2xl shadow-xl border border-[#27272a] p-8 mb-10 animate-fade-in flex flex-col items-center">
        <p className="text-[#e4e4e7] mb-4 text-center">すでに申請済みの方はこちらからログイン</p>
        <button
          onClick={loginWithGoogle}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#2f9e44] to-[#22d3ee] hover:from-[#22d3ee] hover:to-[#2f9e44] text-white px-6 py-3 rounded-full font-bold text-lg transition mb-4 shadow-lg hover:scale-105"
        >
          <FaGoogle className="text-xl" /> Googleでログイン
        </button>
        <div className="w-full mt-2">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-3 mb-3 border rounded-lg bg-[#18181b] text-[#f4f4f5] border-[#27272a] focus:border-[#22d3ee] focus:ring-2 focus:ring-[#22d3ee] transition"
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-3 mb-3 border rounded-lg bg-[#18181b] text-[#f4f4f5] border-[#27272a] focus:border-[#22d3ee] focus:ring-2 focus:ring-[#22d3ee] transition"
          />
          <button
            onClick={handleEmailAuth}
            className="w-full bg-gradient-to-r from-[#c92a2a] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#c92a2a] text-[#18181b] font-bold py-3 rounded-full shadow-lg hover:scale-105 transition mb-2"
          >
            {isRegistering ? "新規登録" : "ログイン"}
          </button>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-blue-400 mt-2 underline hover:text-blue-300 transition"
          >
            {isRegistering ? "ログインへ切り替え" : "新規登録へ切り替え"}
          </button>
        </div>
      </section>

      <footer className="text-[#a1a1aa] text-sm mt-10 mb-4">
        &copy; 2025 Kimuchi. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;






