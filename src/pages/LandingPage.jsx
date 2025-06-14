// src/pages/LandingPage.jsx

import { useEffect } from 'react';
import { logout, onAuthChange } from '../firebase';

function LandingPage() {
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        await logout();
        alert("このページは承認前のユーザーのみが閲覧できます。ログアウトしました。");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#fff4e6] text-center px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-[#c92a2a] mb-6">
        Kimuchiへようこそ
      </h1>
      <p className="text-lg text-gray-700 max-w-xl mx-auto mb-4">
        OCC専用、完全非公開の授業評価コミュニティ。
        GPAと時間を守る、選ばれた人だけの楽単情報プラットフォーム。
      </p>

      <div className="bg-white rounded-2xl shadow-md p-6 max-w-lg mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-[#2f9e44] mb-2">ご利用条件</h2>
        <ul className="text-left text-gray-800 list-disc pl-6 space-y-1">
          <li>承認制（Googleログイン＋申請必須）</li>
          <li>Zelleで一括支払い（$49.9 / 3ヶ月）</li>
          <li>ログイン情報・内容の外部共有は<strong>厳禁</strong></li>
        </ul>

        <div className="mt-6 text-left">
          <h3 className="text-lg font-medium text-[#c92a2a] mb-2">ご利用までの流れ</h3>
          <ol className="list-decimal pl-6 text-gray-700 space-y-1">
            <li>Zelleに <strong>49.9ドル</strong> を送金（<strong>受取人名:</strong> あなたの名前）</li>
            <li>以下の申請フォームに必要事項を記入</li>
            <li>審査後、24時間以内に結果をご連絡します</li>
          </ol>
        </div>

        <a
          href="https://your-form-url.com" // ← GoogleフォームURLに差し替えてください
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block bg-[#2f9e44] text-white rounded-full px-6 py-3 text-lg font-medium hover:bg-[#28a745] transition"
        >
          申請フォームはこちら
        </a>
      </div>

      <footer className="text-gray-600 text-sm mt-10">
        &copy; 2025 Kimuchi. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;

