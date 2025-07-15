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

  // デモログイン（匿名ログインのみ実行）
  const handleDemoLogin = async () => {
    try {
      await loginAnonymously();
      navigate("/demo");
    } catch (e) {
      alert("デモログインに失敗しました");
    }
  };

  // 匿名ユーザーになったら自動で/homeへ遷移
  useEffect(() => {
    if (user && user.isAnonymous) {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8" style={{ background: 'linear-gradient(to bottom, #f1f5f9, #e2e8f0 80%, #f1f5f9)', color: '#1e293b' }}>
      {/* ヒーローセクション（UI/UX最適化＋デモ体験ボタン） */}
      <section className="w-full max-w-xl flex flex-col items-center text-center mb-16 mx-auto animate-fadein" style={{paddingTop: '6vh', paddingBottom: '6vh', margin: '0 auto'}}> 
        <img src="/logo.png" alt="Kimuchi logo" className="w-24 h-24 md:w-32 md:h-32 max-w-[130px] object-contain object-center rounded-full shadow-2xl border-4 border-[#fbbf24] bg-[#18181b] mb-8 animate-pop" style={{transition: 'box-shadow 0.3s'}} />
        <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow mb-4 tracking-tight animate-slidein" style={{ color: '#2563eb', letterSpacing: '0.04em', lineHeight: 1.1 }}>Kimuchi</h1>
        <p className="text-xl md:text-2xl mb-10 font-light leading-relaxed max-w-xl mx-auto text-center animate-fadein" style={{ color: '#334155', lineHeight: 1.6 }}>
          とある大学の、完全非公開の授業評価コミュニティ。<br />
          GPAと時間を守る、選ばれた人だけの楽単情報プラットフォーム。
        </p>
        {/* 会員数表示（カウントアップ風） */}
        <div id="member-count" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(34, 211, 238, 0.1)',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          borderRadius: '9999px',
          padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
          marginBottom: '1.5rem',
          color: '#22d3ee',
          fontSize: isMobile ? '1rem' : '1.1rem',
          fontWeight: 'bold',
          minWidth: 180,
          justifyContent: 'center',
          transition: 'background 0.3s',
        }}>
          <FaUsers style={{ fontSize: isMobile ? '1.1rem' : '1.2rem' }} />
          <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.2em', transition: 'color 0.3s' }}>{approvedUserCount}</span>名が参加中
        </div>
        {/* CTAボタン（ホバー演出強化） */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full mb-2">
          <a
            href="#apply"
            style={{
              display:'inline-flex',alignItems:'center',gap:'0.75rem',background:'linear-gradient(90deg,#2563eb,#1e40af)',color:'#fff',borderRadius:'9999px',padding:'1.25rem 2.5rem',fontSize:'1.3rem',fontWeight:'bold',boxShadow:'0 4px 24px rgba(30,41,59,0.12)',textDecoration:'none',transition:'transform 0.2s,box-shadow 0.2s,background 0.2s',letterSpacing:'0.02em',position:'relative',overflow:'hidden',border:'none',outline:'none',cursor:'pointer',willChange:'transform',
            }}
            onMouseOver={e=>{e.currentTarget.style.transform='scale(1.08)';e.currentTarget.style.background='linear-gradient(90deg,#1e40af,#2563eb)';e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.22)';}}
            onMouseOut={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.background='linear-gradient(90deg,#2563eb,#1e40af)';e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.18)';}}
          >
            まずは申請する <FaArrowRight style={{fontSize:'1.3em'}} />
          </a>
          <button
            onClick={handleDemoLogin}
            style={{
              display:'inline-flex',alignItems:'center',gap:'0.75rem',background:'linear-gradient(90deg,#22d3ee,#2563eb)',color:'#18181b',borderRadius:'9999px',padding:'1.25rem 2.5rem',fontSize:'1.1rem',fontWeight:'bold',boxShadow:'0 2px 8px rgba(30,41,59,0.10)',textDecoration:'none',transition:'transform 0.2s,box-shadow 0.2s,background 0.2s',letterSpacing:'0.02em',border:'none',outline:'none',cursor:'pointer',willChange:'transform',
            }}
            onMouseOver={e=>{e.currentTarget.style.transform='scale(1.06)';e.currentTarget.style.background='linear-gradient(90deg,#2563eb,#22d3ee)';e.currentTarget.style.boxShadow='0 6px 18px rgba(30,41,59,0.18)';}}
            onMouseOut={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.background='linear-gradient(90deg,#22d3ee,#2563eb)';e.currentTarget.style.boxShadow='0 2px 8px rgba(30,41,59,0.10)';}}
          >
            デモ体験（ゲスト）
          </button>
        </div>
      </section>

      {/* SNSシェアボタン */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {/* X（Twitter） */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Kimuchi｜先輩直伝の楽単・授業情報コミュニティ')}&url=${encodeURIComponent(window.location.origin)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1da1f2', color: '#fff', borderRadius: 9999, padding: '0.7rem 1.5rem', fontWeight: 'bold', textDecoration: 'none', fontSize: '1rem' }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 5.924c-.793.352-1.645.59-2.54.697a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 11.07 9.03c0 .352.04.695.116 1.022C7.728 9.89 4.1 8.1 1.67 5.149a4.48 4.48 0 0 0-.606 2.254c0 1.555.792 2.927 2.002 3.732a4.48 4.48 0 0 1-2.03-.561v.057a4.48 4.48 0 0 0 3.6 4.393c-.193.053-.397.082-.607.082-.148 0-.292-.014-.432-.04a4.48 4.48 0 0 0 4.18 3.11A8.98 8.98 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.017c8.26 0 12.78-6.84 12.78-12.78 0-.195-.004-.39-.013-.583A9.14 9.14 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.697z"/></svg>
          Xでシェア
        </a>
        {/* LINE */}
        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.origin)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#06c755', color: '#fff', borderRadius: 9999, padding: '0.7rem 1.5rem', fontWeight: 'bold', textDecoration: 'none', fontSize: '1rem' }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184C17.413 1.13 14.13.013 10.66.013 4.77.013 0 4.13 0 9.22c0 2.92 1.68 5.53 4.36 7.23-.18.62-.98 3.36-1.02 3.56 0 .01-.01.05.02.07.03.02.07.01.08.01.11-.02 3.52-2.32 4.13-2.7.97.14 1.97.22 3.08.22 5.89 0 10.66-4.12 10.66-9.21 0-2.19-1.09-4.25-3.13-6.18z"/></svg>
          LINEでシェア
        </a>
        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1877f2', color: '#fff', borderRadius: 9999, padding: '0.7rem 1.5rem', fontWeight: 'bold', textDecoration: 'none', fontSize: '1rem' }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
          Facebookでシェア
        </a>
        {/* URLコピー */}
        <button
          onClick={() => {navigator.clipboard.writeText(window.location.origin); alert('URLをコピーしました！');}}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#334155', color: '#fff', borderRadius: 9999, padding: '0.7rem 1.5rem', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer' }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          URLコピー
        </button>
      </div>

      {/* なぜKimuchiなのかセクション（中央寄せ） */}
      <section className="w-full max-w-xl mx-auto mb-12 p-6 bg-white rounded-2xl shadow-lg border border-[#e0e7ef] text-center">
        <h2 className="text-2xl font-bold mb-4 text-[#2563eb]">なぜKimuchiなのか？</h2>
        <p className="text-lg text-[#334155] leading-relaxed">
          他に同じようなサービスは存在しません。<br />
          留学エージェントに何十万円も支払うよりも、実際に現地で学んだ先輩たちから最新・リアルな授業情報や体験談を、圧倒的に安い入会金で手に入れることができます。<br />
          Kimuchiは、信頼できるコミュニティだからこそ、ネットやSNSでは得られない「本当に役立つ情報」だけを厳選して提供しています。
        </p>
      </section>

      {/* 会員の声セクション（中央寄せ・カード修正） */}
      <section className="w-full max-w-xl mx-auto mb-12 p-6 bg-[#f1f5f9] rounded-2xl shadow border border-[#e0e7ef] text-center">
        <h2 className="text-xl font-bold mb-4 text-[#22d3ee]">会員の声</h2>
        <div style={{overflowX:'auto',whiteSpace:'nowrap',paddingBottom:8,margin:'0 auto',maxWidth:480}}>
          <div style={{display:'inline-flex',gap:24}}>
            <div style={{minWidth:220,maxWidth:280,background:'#fff',border:'1.5px solid #e0e7ef',borderRadius:16,padding:'20px 16px',boxShadow:'0 2px 8px rgba(30,41,59,0.08)',color:'#334155',fontSize:'1rem',textAlign:'left',wordBreak:'break-word',overflowWrap:'break-word'}}>
              <span style={{fontWeight:'bold',color:'#2563eb',wordBreak:'break-word'}}>「本当に楽単情報が手に入って、GPAも上がりました！」</span>
              <div style={{fontSize:'0.9rem',color:'#a1a1aa',marginTop:8}}>（経済学部2年）</div>
            </div>
            <div style={{minWidth:220,maxWidth:280,background:'#fff',border:'1.5px solid #e0e7ef',borderRadius:16,padding:'20px 16px',boxShadow:'0 2px 8px rgba(30,41,59,0.08)',color:'#334155',fontSize:'1rem',textAlign:'left',wordBreak:'break-word',overflowWrap:'break-word'}}>
              <span style={{fontWeight:'bold',color:'#2563eb',wordBreak:'break-word'}}>「エージェントよりもリアルな体験談が聞けて安心できた」</span>
              <div style={{fontSize:'0.9rem',color:'#a1a1aa',marginTop:8}}>（理系1年）</div>
            </div>
            <div style={{minWidth:220,maxWidth:280,background:'#fff',border:'1.5px solid #e0e7ef',borderRadius:16,padding:'20px 16px',boxShadow:'0 2px 8px rgba(30,41,59,0.08)',color:'#334155',fontSize:'1rem',textAlign:'left',wordBreak:'break-word',overflowWrap:'break-word'}}>
              <span style={{fontWeight:'bold',color:'#2563eb',wordBreak:'break-word'}}>「入会金だけでずっと使えるのがありがたい」</span>
              <div style={{fontSize:'0.9rem',color:'#a1a1aa',marginTop:8}}>（文系3年）</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ・サポートセクション（折りたたみ式） */}
      <section className="w-full max-w-2xl mx-auto mb-12 p-6 bg-[#f1f5f9] rounded-2xl shadow border border-[#e0e7ef] text-center">
        <h2 className="text-xl font-bold mb-4 text-[#2563eb]">よくある質問（FAQ）</h2>
        <ul className="space-y-4 mb-6" style={{textAlign:'left',margin:'0 auto',maxWidth:500}}>
          <li>
            <strong>Q. 入会後に追加料金はかかりますか？</strong><br />
            A. いいえ、入会金$50のみで追加料金は一切かかりません。
          </li>
          <li>
            <strong>Q. どんな情報が見られますか？</strong><br />
            A. 実際に現地で学んだ先輩たちによる最新の授業評価・体験談・楽単情報などが見られます。
          </li>
        </ul>
        <button
          onClick={() => setShowAllFaqs(true)}
          style={{display: showAllFaqs ? 'none' : 'inline-block', background: 'linear-gradient(90deg,#2563eb,#1e40af)', color: '#fff', borderRadius: '9999px', padding: '0.7rem 2rem', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', marginBottom: 16, marginTop: 8}}
        >もっと見る</button>
        {showAllFaqs && (
          <ul className="space-y-4 mb-6" style={{textAlign:'left',margin:'0 auto',maxWidth:500}}>
            <li>
              <strong>Q. 承認までどれくらいかかりますか？</strong><br />
              A. 通常24時間以内に審査結果をご連絡します。
            </li>
            <li>
              <strong>Q. 退会はできますか？</strong><br />
              A. いつでも退会可能です。サポートまでご連絡ください。
            </li>
            <li>
              <strong>Q. サポートへの連絡方法は？</strong><br />
              A. 下記「お問い合わせ」ボタンからご連絡いただけます。
            </li>
          </ul>
        )}
        <div className="text-center">
          <a href="/contact" style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg,#2563eb,#1e40af)',
            color: '#fff',
            borderRadius: '9999px',
            padding: '1rem 2.5rem',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(30,41,59,0.10)',
            transition: 'background 0.2s',
          }}>
            お問い合わせはこちら
          </a>
        </div>
      </section>

      {/* ご利用条件カード（完全インラインstyle, レスポンシブ対応） */}
      <section
        style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '0 auto 64px auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? '24px' : '32px',
          padding: isMobile ? '0 1rem' : '0',
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? '1.3rem' : '1.5rem',
            fontWeight: 'bold',
            color: '#2f9e44',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: isMobile ? '16px' : '24px',
          }}
        >
          <FaUserShield style={{ color: '#2f9e44' }} /> ご利用条件
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '32px',
            width: '100%',
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {[{
            icon: <FaCheckCircle style={{ color: '#22d3ee', fontSize: isMobile ? '1.8rem' : '2.2rem', marginBottom: '0.75rem' }} />, title: '承認制', desc: 'GoogleまたはEmailログイン＋申請必須'
          }, {
            icon: <FaMoneyCheckAlt style={{ color: '#fbbf24', fontSize: isMobile ? '1.8rem' : '2.2rem', marginBottom: '0.75rem' }} />, title: '入会金', desc: 'Zelleで入会金$50（初回のみ）'
          }, {
            icon: <FaLock style={{ color: '#c92a2a', fontSize: isMobile ? '1.8rem' : '2.2rem', marginBottom: '0.75rem' }} />, title: '外部共有は厳禁', desc: 'ログイン情報・内容の外部共有は厳禁'
          }].map((item, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                borderRadius: '1rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                border: '1.5px solid #cbd5e1',
                padding: isMobile ? '1rem' : '2rem',
                width: isMobile ? '100%' : 'auto',
                maxWidth: isMobile ? '100%' : '340px',
                textAlign: 'center',
                flex: isMobile ? 'none' : '1 1 220px',
                color: '#1e293b',
              }}
            >
              {item.icon}
              <div style={{ fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.1rem', marginBottom: '0.5rem' }}>{item.title}</div>
              <div style={{ color: '#334155', fontSize: isMobile ? '0.9rem' : '1rem' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ご利用までの流れセクション（カードのみ・3ステップ） */}
      <section className="w-full max-w-3xl mx-auto mb-12 p-6 bg-white rounded-2xl shadow-lg border border-[#e0e7ef]">
        <h2 className="text-2xl font-bold mb-6 text-[#2563eb]">ご利用までの流れ</h2>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* ステップ1 */}
          <div className="flex flex-col items-center flex-1">
            <div className="bg-[#fbbf24] text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-2 shadow"><FaMoneyCheckAlt /></div>
            <div className="font-bold text-lg mb-1">1. Zelleで$50を一度だけ送金</div>
            <div className="text-[#334155] text-sm text-center">送金先: 657-709-1289</div>
          </div>
          <div className="hidden md:block text-3xl text-[#a1a1aa] mx-2">→</div>
          {/* ステップ2 */}
          <div className="flex flex-col items-center flex-1">
            <div className="bg-[#22d3ee] text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-2 shadow"><FaUserShield /></div>
            <div className="font-bold text-lg mb-1">2. 申請フォームに必要事項を記入</div>
            <div className="text-[#334155] text-sm text-center">簡単な情報を入力するだけ</div>
          </div>
          <div className="hidden md:block text-3xl text-[#a1a1aa] mx-2">→</div>
          {/* ステップ3 */}
          <div className="flex flex-col items-center flex-1">
            <div className="bg-[#6366f1] text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-2 shadow"><FaCheckCircle /></div>
            <div className="font-bold text-lg mb-1">3. 審査後、24時間以内に結果をご連絡</div>
            <div className="text-[#334155] text-sm text-center">承認後すぐに全機能利用可能</div>
          </div>
        </div>
      </section>

      {/* ご利用までの流れ（完全インラインstyleステップ型, レスポンシブ対応） */}
      <section
        id="apply"
        style={{
          width: '100%',
          maxWidth: '900px',
          background: '#fff',
          borderRadius: '1rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
          border: '1.5px solid #cbd5e1',
          padding: isMobile ? '1.5rem 1rem' : '2.5rem',
          margin: '0 auto 64px auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: '#1e293b',
        }}
      >
        <h3
          style={{
            fontSize: isMobile ? '1.1rem' : '1.4rem',
            fontWeight: 'bold',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: isMobile ? '1.2rem' : '2rem',
          }}
        >
          <HiOutlineArrowRight style={{ color: '#2563eb', fontSize: isMobile ? '1.3rem' : '1.5rem' }} /> ご利用までの流れ
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '20px' : '32px',
            width: '100%',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: isMobile ? '1.2rem' : '2rem',
            alignItems: 'center',
          }}
        >
          {[{
            num: '1',
            desc: <>Zelleで <strong>$50</strong> を一度だけ送金<br /><span style={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>（送金先電話番号: 657-709-1289）</span></>
          }, {
            num: '2',
            desc: <>申請フォームに必要事項を記入</>
          }, {
            num: '3',
            desc: <>審査後、24時間以内に結果をご連絡</>
          }].map((item, i) => (
            <div
              key={i}
              style={{
                flex: isMobile ? 'none' : '1 1 220px',
                maxWidth: isMobile ? '100%' : '260px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: isMobile ? '100%' : 'auto',
              }}
            >
              <div
                style={{
                  background: '#fff',
                  border: '3px solid #2563eb',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 12px rgba(30,41,59,0.10)',
                  width: isMobile ? '48px' : '64px',
                  height: isMobile ? '48px' : '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '1.2rem' : '2rem',
                  fontWeight: 'bold',
                  color: '#2563eb',
                  marginBottom: '0.75rem',
                }}
              >
                {item.num}
              </div>
              <div style={{ color: '#334155', textAlign: 'center', fontSize: isMobile ? '0.9rem' : '1rem' }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeiKGlblgkAzjJmbVEno3L5lwWPiVt6ECZgt0OV9Ps6r6SRmw/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: '1rem',
            display: 'inline-block',
            background: 'linear-gradient(90deg,#2f9e44,#22d3ee)',
            color: '#fff',
            borderRadius: '9999px',
            padding: isMobile ? '0.8rem 1.5rem' : '1rem 2.5rem',
            fontSize: isMobile ? '0.9rem' : '1.1rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            textDecoration: 'none',
            transition: 'transform 0.2s,box-shadow 0.2s',
          }}
        >
          申請フォームはこちら
        </a>
      </section>

      {/* ログイン・登録フォーム（カード型・モダンUI, レスポンシブ対応） */}
      <section
        style={{
          width: '100%',
          maxWidth: isMobile ? '95vw' : '420px',
          background: '#fff',
          borderRadius: '1.2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.22)',
          border: '1.5px solid #cbd5e1',
          padding: isMobile ? '1.5rem 1rem' : '2.5rem 2rem',
          margin: '0 auto 40px auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.2rem',
          color: '#1e293b',
        }}
      >
        <p style={{ color: '#334155', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: isMobile ? '0.95rem' : '1.08rem', textAlign: 'center' }}>
          すでに申請済みの方はこちらからログイン
        </p>
        <button
          onClick={loginWithGoogle}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.7rem',
            background: 'linear-gradient(90deg,#2f9e44,#22d3ee)',
            color: '#fff',
            borderRadius: '9999px',
            padding: isMobile ? '0.7rem 1.2rem' : '0.9rem 2.2rem',
            fontWeight: 'bold',
            fontSize: isMobile ? '0.95rem' : '1.1rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            marginBottom: '1.1rem',
            transition: 'transform 0.2s,box-shadow 0.2s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.22)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';
          }}
        >
          <FaGoogle style={{ fontSize: isMobile ? '1.1em' : '1.3em' }} /> Googleでログイン
        </button>
        <form
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.7rem',
          }}
          onSubmit={e => {
            e.preventDefault();
            handleEmailAuth();
          }}
        >
          <label htmlFor="email" style={{ color: '#334155', fontWeight: 'bold', marginBottom: '0.2rem', textAlign: 'left', fontSize: isMobile ? '0.9rem' : '1rem' }}>
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: isMobile ? '0.7rem' : '0.9rem',
              borderRadius: '0.7rem',
              background: '#fff',
              color: '#1e293b',
              border: '1.5px solid #cbd5e1',
              fontSize: isMobile ? '0.9rem' : '1rem',
              marginBottom: '0.1rem',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#2563eb'}
            onBlur={e => e.target.style.borderColor = '#cbd5e1'}
          />
          <label htmlFor="password" style={{ color: '#334155', fontWeight: 'bold', marginBottom: '0.2rem', textAlign: 'left', fontSize: isMobile ? '0.9rem' : '1rem' }}>
            パスワード
          </label>
          <input
            id="password"
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: isMobile ? '0.7rem' : '0.9rem',
              borderRadius: '0.7rem',
              background: '#fff',
              color: '#1e293b',
              border: '1.5px solid #cbd5e1',
              fontSize: isMobile ? '0.9rem' : '1rem',
              marginBottom: '0.1rem',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#2563eb'}
            onBlur={e => e.target.style.borderColor = '#cbd5e1'}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(90deg,#c92a2a,#fbbf24)',
              color: '#18181b',
              fontWeight: 'bold',
              fontSize: isMobile ? '0.95rem' : '1.1rem',
              padding: isMobile ? '0.7rem' : '0.9rem',
              borderRadius: '9999px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
              border: 'none',
              outline: 'none',
              marginTop: '0.7rem',
              marginBottom: '0.2rem',
              cursor: 'pointer',
              transition: 'transform 0.2s,box-shadow 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.22)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';
            }}
          >
            {isRegistering ? '新規登録' : 'ログイン'}
          </button>
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          style={{
            fontSize: isMobile ? '0.9rem' : '1rem',
            color: '#a5b4fc',
            background: 'none',
            border: 'none',
            textDecoration: 'underline',
            marginTop: '0.5rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: '0.3rem 0.7rem',
            borderRadius: '0.5rem',
            transition: 'color 0.2s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.color = '#818cf8';
          }}
          onMouseOut={e => {
            e.currentTarget.style.color = '#a5b4fc';
          }}
        >
          {isRegistering ? 'ログインへ切り替え' : '新規登録へ切り替え'}
        </button>
      </section>

      <footer className="text-[#64748b] text-sm mt-10 mb-4">
        &copy; 2025 Kimuchi. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;






