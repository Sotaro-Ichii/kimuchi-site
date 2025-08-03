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
import { 
  FaCheckCircle, 
  FaUserShield, 
  FaMoneyCheckAlt, 
  FaLock, 
  FaGoogle, 
  FaArrowRight, 
  FaUsers, 
  FaStar,
  FaGraduationCap,
  FaHandshake,
  FaShieldAlt,
  FaRocket,
  FaHeart,
  FaLightbulb,
  FaGlobe
} from 'react-icons/fa';
import { HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-800">
      {/* ヒーローセクション */}
      <section className="relative w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 text-center overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
        
        <div className="relative z-10">
          {/* ロゴとタイトル */}
          <div className="mb-8">
            <div className="relative inline-block">
              <img 
                src="/logo.png" 
                alt="Musashi logo" 
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-4 object-contain drop-shadow-2xl animate-float" 
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                <HiOutlineSparkles className="text-white text-xs" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Musashi
            </h1>
            <p className="text-sm sm:text-base md:text-lg mb-6 font-light leading-relaxed max-w-3xl mx-auto text-slate-600">
              とある大学の、<span className="font-semibold text-blue-600">完全非公開</span>の授業評価コミュニティ。<br />
              編入成功者たちからの楽単情報を、<span className="font-semibold text-purple-600">圧倒的に安い入会金</span>で手に入れることができます。
            </p>
          </div>
          
          {/* 会員数表示 */}
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-full px-4 sm:px-6 py-3 mb-8 text-cyan-700 font-bold w-fit mx-auto shadow-lg backdrop-blur-sm">
            <FaUsers className="text-sm sm:text-base" />
            <span className="font-mono text-base sm:text-lg">{approvedUserCount}</span>名が参加中
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* ログインフォーム */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/20 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <FaUserShield className="text-2xl text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">ログイン / 登録</h2>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="メールアドレス"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white/50 backdrop-blur-sm transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaGlobe className="text-slate-400 text-sm" />
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="password"
                  placeholder="パスワード"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white/50 backdrop-blur-sm transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaLock className="text-slate-400 text-sm" />
                </div>
              </div>
              
              <button
                onClick={handleEmailAuth}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isRegistering ? "登録" : "ログイン"}
              </button>
              
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full text-blue-600 hover:text-blue-700 text-xs sm:text-sm transition-colors duration-300"
              >
                {isRegistering ? "既にアカウントをお持ちの方はこちら" : "新規登録はこちら"}
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-3 bg-white/80 text-slate-500">または</span>
                </div>
              </div>
              
              <button
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-300 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 hover:border-blue-300 transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg"
              >
                <FaGoogle className="text-red-500 text-lg" />
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
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold shadow-xl no-underline transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-blue-700 hover:to-purple-700"
            >
              まずは申請する 
              <FaArrowRight className="text-sm sm:text-lg group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <button
              onClick={handleDemoLogin}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-cyan-500 hover:to-blue-600"
            >
              <FaRocket className="text-sm sm:text-base group-hover:rotate-12 transition-transform duration-300" />
              デモ体験（ゲスト）
            </button>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="w-full max-w-6xl mx-auto px-4 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 text-center border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaGraduationCap className="text-white text-2xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">先輩直伝の情報</h3>
            <p className="text-sm sm:text-base text-slate-600">実際に現地で学んだ先輩たちからの最新・リアルな授業情報</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 text-center border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHandshake className="text-white text-2xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">信頼できるコミュニティ</h3>
            <p className="text-sm sm:text-base text-slate-600">厳選されたメンバーによる質の高い情報交換</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 text-center border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMoneyCheckAlt className="text-white text-2xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">圧倒的なコストパフォーマンス</h3>
            <p className="text-sm sm:text-base text-slate-600">留学エージェントの何十分の一の価格で貴重な情報を入手</p>
          </div>
        </div>
      </section>

      {/* SNSシェアボタン */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Musashi｜先輩直伝の楽単・授業情報コミュニティ')}&url=${encodeURIComponent(window.location.origin)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full px-4 sm:px-5 py-2 sm:py-3 font-bold no-underline text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 5.924c-.793.352-1.645.59-2.54.697a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 11.07 9.03c0 .352.04.695.116 1.022C7.728 9.89 4.1 8.1 1.67 5.149a4.48 4.48 0 0 0-.606 2.254c0 1.555.792 2.927 2.002 3.732a4.48 4.48 0 0 1-2.03-.561v.057a4.48 4.48 0 0 0 3.6 4.393c-.193.053-.397.082-.607.082-.148 0-.292-.014-.432-.04a4.48 4.48 0 0 0 4.18 3.11A8.98 8.98 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.017c8.26 0 12.78-6.84 12.78-12.78 0-.195-.004-.39-.013-.583A9.14 9.14 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.697z"/></svg>
          Xでシェア
        </a>
        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.origin)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full px-4 sm:px-5 py-2 sm:py-3 font-bold no-underline text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184C17.413 1.13 14.13.013 10.66.013 4.77.013 0 4.13 0 9.22c0 2.92 1.68 5.53 4.36 7.23-.18.62-.98 3.36-1.02 3.56 0 .01-.01.05.02.07.03.02.07.01.08.01.11-.02 3.52-2.32 4.13-2.7.97.14 1.97.22 3.08.22 5.89 0 10.66-4.12 10.66-9.21 0-2.19-1.09-4.25-3.13-6.18z"/></svg>
          LINEでシェア
        </a>
        <a
          href="https://www.instagram.com/musashi.official/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full px-4 sm:px-5 py-2 sm:py-3 font-bold no-underline text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.782 2.295 7.148 2.233 8.414 2.175 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.213 2.092-1.272 3.373C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.613.059 1.281.292 2.393 1.272 3.373.98.98 2.092 1.213 3.373 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.292 3.373-1.272.98-.98 1.213-2.092 1.272-3.373.059-1.281.072-1.69.072-7.613 0-5.923-.013-6.332-.072-7.613-.059-1.281-.292-2.393-1.272-3.373-.98-.98-2.092-1.213-3.373-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
          Instagramでシェア
        </a>
        <button
          onClick={() => {navigator.clipboard.writeText(window.location.origin); alert('URLをコピーしました！');}}
          className="group inline-flex items-center gap-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-full px-4 sm:px-5 py-2 sm:py-3 font-bold text-xs sm:text-sm border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          URLコピー
        </button>
      </div>

      {/* なぜMusashiなのかセクション */}
      <section className="w-full max-w-6xl mx-auto px-4 mb-12 sm:mb-16">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 sm:p-12 text-center border border-indigo-200 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FaLightbulb className="text-3xl text-yellow-500" />
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">なぜMusashiなのか？</h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed max-w-4xl mx-auto">
            他に同じようなサービスは存在しません。<br />
            留学エージェントに何十万円も支払うよりも、実際に現地で学んだ先輩たちから最新・リアルな授業情報や体験談を、<span className="font-semibold text-purple-600">圧倒的に安い入会金</span>で手に入れることができます。<br />
            Musashiは、信頼できるコミュニティだからこそ、ネットやSNSでは得られない<span className="font-semibold text-indigo-600">「本当に役立つ情報」</span>だけを厳選して提供しています。
          </p>
        </div>
      </section>

      {/* 会員の声セクション */}
      <section className="w-full max-w-6xl mx-auto px-4 mb-12 sm:mb-16">
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 sm:p-12 text-center border border-cyan-200 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <FaHeart className="text-3xl text-red-500" />
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">会員の声</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-yellow-400 text-2xl sm:text-3xl mb-4">★★★★★</div>
              <p className="text-sm sm:text-base text-slate-700 mb-4">"先輩の体験談が本当に役立ちました！"</p>
              <p className="text-xs text-slate-500">- 匿名会員</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-yellow-400 text-2xl sm:text-3xl mb-4">★★★★★</div>
              <p className="text-sm sm:text-base text-slate-700 mb-4">"楽単情報で単位取得が楽になりました"</p>
              <p className="text-xs text-slate-500">- 編入生A</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-yellow-400 text-2xl sm:text-3xl mb-4">★★★★★</div>
              <p className="text-sm sm:text-base text-slate-700 mb-4">"コミュニティがとても温かいです"</p>
              <p className="text-xs text-slate-500">- 留学生B</p>
            </div>
          </div>
        </div>
      </section>

      {/* よくある質問セクション */}
      <section className="w-full max-w-6xl mx-auto px-4 mb-12 sm:mb-16">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <FaShieldAlt className="text-3xl text-emerald-500" />
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent text-center">よくある質問</h2>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-slate-800 mb-3">Q: 入会金はいくらですか？</h3>
              <p className="text-sm sm:text-base text-slate-700">A: 現在特別価格で$50です。通常価格より大幅に割引しています。</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-slate-800 mb-3">Q: どのような情報が得られますか？</h3>
              <p className="text-sm sm:text-base text-slate-700">A: 楽単情報、授業評価、教授の特徴、試験対策など、実際の体験談を中心とした情報を提供しています。</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-slate-800 mb-3">Q: 退会はいつでもできますか？</h3>
              <p className="text-sm sm:text-base text-slate-700">A: はい、いつでも退会可能です。ただし、入会金の返金はできません。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 申請フォームセクション */}
      <section id="apply" className="w-full max-w-6xl mx-auto px-4 mb-12 sm:mb-16">
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          {/* 背景装飾 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <FaRocket className="text-3xl text-yellow-300" />
              <h2 className="text-2xl sm:text-3xl font-bold">今すぐ申請する</h2>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-8 max-w-2xl mx-auto">限定価格で先輩たちの貴重な情報を手に入れましょう</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://forms.gle/your-application-form-url"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white text-blue-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-bold hover:bg-blue-50 transition-all duration-300 text-sm sm:text-base md:text-lg inline-block text-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                申請フォームへ
              </a>
              <button 
                onClick={handleDemoLogin}
                className="group border-2 border-white text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                デモ体験
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-4 sm:mb-6">© 2024 Musashi. All rights reserved.</p>
          <div className="flex justify-center gap-6 sm:gap-8 text-sm sm:text-base">
            <Link to="/legal" className="text-slate-300 hover:text-white transition-colors duration-300">利用規約</Link>
            <Link to="/contact" className="text-slate-300 hover:text-white transition-colors duration-300">お問い合わせ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;






