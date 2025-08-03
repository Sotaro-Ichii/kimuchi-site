// ✅ 完成版 LandingPage.jsx

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logout,
  db,
  loginAnonymously,
} from "../firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { FaCheckCircle, FaUserShield, FaMoneyCheckAlt, FaLock, FaGoogle, FaArrowRight, FaUsers } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';

function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [approvedUserCount, setApprovedUserCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  // 画面サイズの監視
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 承認済みユーザー数を取得
  useEffect(() => {
    const fetchApprovedUserCount = async () => {
      try {
        const approvedUsersRef = collection(db, "approvedUsers");
        const q = query(approvedUsersRef, where("status", "==", "approved"));
        const querySnapshot = await getDocs(q);
        setApprovedUserCount(querySnapshot.size);
      } catch (error) {
        console.error("承認済みユーザー数取得エラー:", error);
        // エラーが発生してもアプリは継続動作
      }
    };

    fetchApprovedUserCount();
  }, []);

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

  // デモログイン（Firebase認証なしでデモページへ遷移）
  const handleDemoLogin = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      {/* ヒーローセクション */}
      <section className="w-full max-w-4xl mx-auto px-4 py-8 text-center">
        <img src="/logo.png" alt="Musashi logo" className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 object-contain shadow-lg" />
        <p className="text-base md:text-lg mb-8 font-light leading-relaxed max-w-2xl mx-auto text-slate-700">
          とある大学の、完全非公開の授業評価コミュニティ。<br />
          編入成功者たちからの楽単情報を、圧倒的に安い入会金で手に入れることができます。
        </p>
        
        {/* 会員数表示 */}
        <div className="flex items-center justify-center gap-2 bg-cyan-50 border border-cyan-200 rounded-full px-4 py-2 mb-8 text-cyan-600 font-bold w-fit mx-auto">
          <FaUsers className="text-sm" />
          <span className="font-mono text-base">{approvedUserCount}</span>名が参加中
        </div>
        
        {/* ログインフォーム */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200 mb-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-6 text-slate-800">ログイン / 登録</h2>
          
          <div className="space-y-4">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <button
              onClick={handleEmailAuth}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              {isRegistering ? "登録" : "ログイン"}
            </button>
            
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-blue-600 hover:text-blue-700 text-sm"
            >
              {isRegistering ? "既にアカウントをお持ちの方はこちら" : "新規登録はこちら"}
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">または</span>
              </div>
            </div>
            
            <button
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors"
            >
              <FaGoogle className="text-red-500" />
              Googleでログイン
            </button>
          </div>
        </div>
        
        {/* CTAボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <a
            href="https://forms.gle/your-application-form-url"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full px-6 py-3 text-base font-bold shadow-lg no-underline transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            まずは申請する <FaArrowRight className="text-lg" />
          </a>
          <button
            onClick={handleDemoLogin}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full px-6 py-3 text-sm font-bold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            デモ体験（ゲスト）
          </button>
        </div>
      </section>

      {/* SNSシェアボタン */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 px-4">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Musashi｜先輩直伝の楽単・授業情報コミュニティ')}&url=${encodeURIComponent(window.location.origin)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#1da1f2] text-white rounded-full px-4 py-2 font-bold no-underline text-sm shadow hover:opacity-90 transition"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 5.924c-.793.352-1.645.59-2.54.697a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 11.07 9.03c0 .352.04.695.116 1.022C7.728 9.89 4.1 8.1 1.67 5.149a4.48 4.48 0 0 0-.606 2.254c0 1.555.792 2.927 2.002 3.732a4.48 4.48 0 0 1-2.03-.561v.057a4.48 4.48 0 0 0 3.6 4.393c-.193.053-.397.082-.607.082-.148 0-.292-.014-.432-.04a4.48 4.48 0 0 0 4.18 3.11A8.98 8.98 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.017c8.26 0 12.78-6.84 12.78-12.78 0-.195-.004-.39-.013-.583A9.14 9.14 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.697z"/></svg>
          Xでシェア
        </a>
        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.origin)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#06c755] text-white rounded-full px-4 py-2 font-bold no-underline text-sm shadow hover:opacity-90 transition"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184C17.413 1.13 14.13.013 10.66.013 4.77.013 0 4.13 0 9.22c0 2.92 1.68 5.53 4.36 7.23-.18.62-.98 3.36-1.02 3.56 0 .01-.01.05.02.07.03.02.07.01.08.01.11-.02 3.52-2.32 4.13-2.7.97.14 1.97.22 3.08.22 5.89 0 10.66-4.12 10.66-9.21 0-2.19-1.09-4.25-3.13-6.18z"/></svg>
          LINEでシェア
        </a>
        <a
          href="https://www.instagram.com/musashi.official/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full px-4 py-2 font-bold no-underline text-sm shadow hover:opacity-90 transition"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.782 2.295 7.148 2.233 8.414 2.175 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.213 2.092-1.272 3.373C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.613.059 1.281.292 2.393 1.272 3.373.98.98 2.092 1.213 3.373 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.292 3.373-1.272.98-.98 1.213-2.092 1.272-3.373.059-1.281.072-1.69.072-7.613 0-5.923-.013-6.332-.072-7.613-.059-1.281-.292-2.393-1.272-3.373-.98-.98-2.092-1.213-3.373-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
          Instagramでシェア
        </a>
        <button
          onClick={() => {navigator.clipboard.writeText(window.location.origin); alert('URLをコピーしました！');}}
          className="inline-flex items-center gap-2 bg-slate-600 text-white rounded-full px-4 py-2 font-bold text-sm border-none shadow hover:opacity-90 transition"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          URLコピー
        </button>
      </div>

      {/* なぜMusashiなのかセクション */}
      <section className="w-full max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-slate-50 rounded-2xl p-6 md:p-8 text-center border border-slate-200">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-600">なぜMusashiなのか？</h2>
          <p className="text-sm md:text-base text-slate-700 leading-relaxed">
            他に同じようなサービスは存在しません。<br />
            留学エージェントに何十万円も支払うよりも、実際に現地で学んだ先輩たちから最新・リアルな授業情報や体験談を、圧倒的に安い入会金で手に入れることができます。<br />
            Musashiは、信頼できるコミュニティだからこそ、ネットやSNSでは得られない「本当に役立つ情報」だけを厳選して提供しています。
          </p>
        </div>
      </section>

      {/* 会員の声セクション */}
      <section className="w-full max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-slate-50 rounded-2xl p-6 md:p-8 text-center border border-slate-200">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-cyan-600">会員の声</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-yellow-400 text-xl md:text-2xl mb-3">★★★★★</div>
              <p className="text-sm md:text-base text-slate-700 mb-3">"先輩の体験談が本当に役立ちました！"</p>
              <p className="text-xs md:text-sm text-slate-500">- 匿名会員</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-yellow-400 text-xl md:text-2xl mb-3">★★★★★</div>
              <p className="text-sm md:text-base text-slate-700 mb-3">"楽単情報で単位取得が楽になりました"</p>
              <p className="text-xs md:text-sm text-slate-500">- 編入生A</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-yellow-400 text-xl md:text-2xl mb-3">★★★★★</div>
              <p className="text-sm md:text-base text-slate-700 mb-3">"コミュニティがとても温かいです"</p>
              <p className="text-xs md:text-sm text-slate-500">- 留学生B</p>
            </div>
          </div>
        </div>
      </section>

      {/* よくある質問セクション */}
      <section className="w-full max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-blue-600 text-center">よくある質問</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-sm md:text-base text-slate-800 mb-2">Q: 入会金はいくらですか？</h3>
              <p className="text-sm md:text-base text-slate-700">A: 現在特別価格で$50です。通常価格より大幅に割引しています。</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-sm md:text-base text-slate-800 mb-2">Q: どのような情報が得られますか？</h3>
              <p className="text-sm md:text-base text-slate-700">A: 楽単情報、授業評価、教授の特徴、試験対策など、実際の体験談を中心とした情報を提供しています。</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-sm md:text-base text-slate-800 mb-2">Q: 退会はいつでもできますか？</h3>
              <p className="text-sm md:text-base text-slate-700">A: はい、いつでも退会可能です。ただし、入会金の返金はできません。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 申請フォームセクション */}
      <section id="apply" className="w-full max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-center text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-4">今すぐ申請する</h2>
          <p className="text-sm md:text-base text-blue-100 mb-6">限定価格で先輩たちの貴重な情報を手に入れましょう</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://forms.gle/your-application-form-url"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-6 md:px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors text-sm md:text-base inline-block text-center"
            >
              申請フォームへ
            </a>
            <button 
              onClick={handleDemoLogin}
              className="border-2 border-white text-white px-6 md:px-8 py-3 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-colors text-sm md:text-base"
            >
              デモ体験
            </button>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm md:text-base text-slate-300 mb-4">© 2024 Musashi. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link to="/legal" className="text-slate-300 hover:text-white transition-colors">利用規約</Link>
            <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">お問い合わせ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;






