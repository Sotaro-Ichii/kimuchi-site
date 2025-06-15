// src/pages/LandingPage.jsx
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { logout } from "../firebase";

function LandingPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      logout();
      alert("未承認のユーザーです。ログアウトしました。");
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-[#fff4e6] px-6 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-[#c92a2a] mb-6">
        Kimuchiへようこそ
      </h1>
      <p className="text-lg text-gray-700 max-w-xl mx-auto mb-4 leading-relaxed">
        Orange Coast College限定の非公開コミュニティ。<br />
        GPAと時間を守る、選ばれた人だけの楽単情報プラットフォーム。
      </p>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-[#2f9e44] mb-4">ご利用条件</h2>
        <ul className="text-left text-gray-800 list-disc pl-6 space-y-2">
          <li>承認制（Googleログイン＋申請フォーム必須）</li>
          <li>Zelleで一括支払い：<strong className="text-[#c92a2a]">$49.9 / 3ヶ月</strong></li>
          <li>ログイン情報やコンテンツの外部共有は<strong className="text-[#c92a2a]">厳禁</strong></li>
        </ul>

        <div className="mt-8 text-left">
          <h3 className="text-lg font-medium text-[#c92a2a] mb-2">ご利用までの流れ</h3>
          <ol className="list-decimal pl-6 text-gray-700 space-y-2">
            <li>
              <strong>Zelle</strong>で <strong>$49.9</strong> を送金（受取人名：<em>あなたの名前</em>）
            </li>
            <li>
              以下の申請フォームに必要事項を記入
            </li>
            <li>
              審査後、24時間以内に結果をご連絡します
            </li>
          </ol>
        </div>

        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeiKGlblgkAzjJmbVEno3L5lwWPiVt6ECZgt0OV9Ps6r6SRmw/viewform?usp=header" // ← 必ずあなたのGoogleフォームURLに変更してください
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block bg-[#2f9e44] text-white rounded-full px-8 py-3 text-lg font-medium hover:bg-[#22863a] transition duration-300"
        >
          申請フォームはこちら
        </a>
      </div>

      <footer className="text-gray-600 text-sm mt-12">
        &copy; 2025 Kimuchi. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;




