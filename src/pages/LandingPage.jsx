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

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8" style={{ background: 'linear-gradient(to bottom, #f1f5f9, #e2e8f0 80%, #f1f5f9)', color: '#1e293b' }}>
      {/* ヒーローセクション */}
      <section className="w-full max-w-2xl flex flex-col items-center text-center mb-16 mx-auto">
        <img src="/logo.png" alt="Kimuchi logo" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 max-w-[120px] object-contain object-center rounded-full shadow-lg border-4 border-[#fbbf24] bg-[#18181b] mb-6" />
        <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow mb-4 tracking-tight" style={{ color: '#2563eb' }}>Kimuchi</h1>
        <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed max-w-xl mx-auto text-center" style={{ color: '#334155' }}>
          とある大学の、完全非公開の授業評価コミュニティ。<br />
          GPAと時間を守る、選ばれた人だけの楽単情報プラットフォーム。
        </p>
        
        {/* 承認済みユーザー数表示 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(34, 211, 238, 0.1)',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            borderRadius: '9999px',
            padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
            marginBottom: '1.5rem',
            color: '#22d3ee',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            fontWeight: 'bold',
          }}
        >
          <FaUsers style={{ fontSize: isMobile ? '0.9rem' : '1rem' }} />
          <span>会員登録者数: {approvedUserCount}名</span>
        </div>
        
        <a
          href="#apply"
          style={{
            display:'inline-flex',alignItems:'center',gap:'0.75rem',background:'linear-gradient(90deg,#2563eb,#1e40af)',color:'#fff',borderRadius:'9999px',padding:'1.25rem 2.5rem',fontSize:'1.3rem',fontWeight:'bold',boxShadow:'0 4px 24px rgba(30,41,59,0.12)',textDecoration:'none',transition:'transform 0.2s,box-shadow 0.2s',marginBottom:'0.5rem',letterSpacing:'0.02em',position:'relative',overflow:'hidden',border:'none',outline:'none',cursor:'pointer'
          }}
          onMouseOver={e=>{e.currentTarget.style.transform='scale(1.06)';e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.22)';}}
          onMouseOut={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.18)';}}
        >
          まずは申請する <FaArrowRight style={{fontSize:'1.3em'}} />
        </a>
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
            icon: <FaMoneyCheckAlt style={{ color: '#fbbf24', fontSize: isMobile ? '1.8rem' : '2.2rem', marginBottom: '0.75rem' }} />, title: 'Zelleで一括支払い', desc: '$49.9 / 3ヶ月'
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
            desc: <>Zelleで <strong>$49.9</strong> を一括zell送金<br /><span style={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>（送金先電話番号: 657-709-1289）</span></>
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






