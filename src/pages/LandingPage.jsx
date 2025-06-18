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
    <div className="min-h-screen bg-[#fff4e6] text-center px-6 py-12 font-sans">
      <h1 className="text-4xl md:text-5xl font-bold text-[#c92a2a] mb-6">
        Kimuchiへようこそ
      </h1>
      <p className="text-lg text-gray-700 max-w-xl mx-auto mb-4">
        とある大学の、完全非公開の授業評価コミュニティ。<br />
        GPAと時間を守る、選ばれた人だけの楽単情報プラットフォーム。<br />
        高GPAを保ちたい、エージェントの履修登録じゃ不安、そんなあなたのためにキムチを作成しました。<br />
        キムチでは、楽単授業、メジャーごとの先輩との相談、メジャーごとの履修コースを紹介いたします。<br />
        先輩方の成功例を下に、Aが取れる授業のみ選別し、掲載しています。
      </p>

      <div className="bg-white rounded-2xl shadow-md text-center p-6 max-w-lg mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-[#2f9e44] mb-2">ご利用条件</h2>
        <ul className="text-left text-gray-800 list-disc pl-6 space-y-1">
          <li>承認制（GoogleまたはEmailログイン＋申請必須）</li>
          <li>Zelleで一括支払い（$49.9 / 3ヶ月）</li>
          <li>ログイン情報・内容の外部共有は<strong>厳禁</strong></li>
        </ul>

        <div className="mt-6 text-left  text-center ">
          <h3 className="text-lg font-medium text-[#c92a2a] mb-2">ご利用までの流れ</h3>
          <ol className="list-decimal pl-6 text-gray-700 space-y-1">
            <li>Zelleで <strong>$49.9</strong> を一括zell送金（<strong>送金先電話番号:</strong> 657-709-1289）</li>
            <li>以下の申請フォームに必要事項を記入</li>
            <li>審査後、24時間以内に結果をご連絡します</li>
          </ol>
        </div>

        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeiKGlblgkAzjJmbVEno3L5lwWPiVt6ECZgt0OV9Ps6r6SRmw/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block bg-[#2f9e44] text-white rounded-full px-6 py-3 text-lg font-medium hover:bg-[#28a745] transition"
        >
          申請フォームはこちら
        </a>

        <div className="mt-8">
          <p className="text-gray-700 mb-2">すでに申請済みの方はこちらからログイン</p>
          <button
            onClick={loginWithGoogle}
            className="bg-[#2f9e44] hover:bg-[#22863a] text-white px-6 py-2 rounded-full font-medium transition mb-4"
          >
            Googleでログイン
          </button>

          <div className="mt-4">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-2 mb-2 border rounded"
            />
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-2 mb-2 border rounded"
            />
            <button
              onClick={handleEmailAuth}
              className="bg-[#c92a2a] hover:bg-[#a82727] text-white px-6 py-2 rounded-full font-medium w-full"
            >
              {isRegistering ? "新規登録" : "ログイン"}
            </button>
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-blue-600 mt-2 underline"
            >
              {isRegistering ? "ログインへ切り替え" : "新規登録へ切り替え"}
            </button>
          </div>
        </div>
      </div>

      <footer className="text-gray-600 text-sm mt-10">
        &copy; 2025 Kimuchi. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;






