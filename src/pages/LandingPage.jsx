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
import { FaCheckCircle, FaUserShield, FaMoneyCheckAlt, FaLock, FaGoogle, FaArrowRight } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';

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
    <div className="min-h-screen bg-gradient-to-b from-[#18181b] via-[#232326] to-[#18181b] flex flex-col items-center px-4 py-8">
      {/* ヒーローセクション */}
      <section className="w-full max-w-2xl flex flex-col items-center text-center mb-16 mx-auto">
        <img src="/logo.png" alt="Kimuchi logo" className="w-24 h-24 md:w-28 md:h-28 max-w-[120px] object-contain object-center rounded-full shadow-lg border-4 border-[#fbbf24] bg-[#18181b] mb-6" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#fbbf24] drop-shadow mb-4 tracking-tight">Kimuchi</h1>
        <p className="text-xl md:text-2xl text-[#e4e4e7] mb-8 font-light leading-relaxed max-w-xl mx-auto text-center">
          とある大学の、完全非公開の授業評価コミュニティ。<br />
          GPAと時間を守る、選ばれた人だけの楽単情報プラットフォーム。
        </p>
        <a
          href="#apply"
          style={{
            display:'inline-flex',alignItems:'center',gap:'0.75rem',background:'linear-gradient(90deg,#fbbf24,#f59e42)',color:'#18181b',borderRadius:'9999px',padding:'1.25rem 2.5rem',fontSize:'1.3rem',fontWeight:'bold',boxShadow:'0 4px 24px rgba(0,0,0,0.18)',textDecoration:'none',transition:'transform 0.2s,box-shadow 0.2s',marginBottom:'0.5rem',letterSpacing:'0.02em',position:'relative',overflow:'hidden',border:'none',outline:'none',cursor:'pointer'
          }}
          onMouseOver={e=>{e.currentTarget.style.transform='scale(1.06)';e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.22)';}}
          onMouseOut={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.18)';}}
        >
          まずは申請する <FaArrowRight style={{fontSize:'1.3em'}} />
        </a>
      </section>

      {/* ご利用条件カード（完全インラインstyle） */}
      <section style={{width:'100%',maxWidth:'1100px',margin:'0 auto 64px auto',display:'flex',flexDirection:'column',alignItems:'center',gap:'32px'}}>
        <h2 style={{fontSize:'1.5rem',fontWeight:'bold',color:'#2f9e44',display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'24px'}}>
          <FaUserShield style={{color:'#2f9e44'}} /> ご利用条件
        </h2>
        <div style={{display:'flex',flexDirection:'row',gap:'32px',width:'100%',justifyContent:'center',flexWrap:'wrap'}}>
          <div style={{background:'#232326',borderRadius:'1rem',boxShadow:'0 4px 24px rgba(0,0,0,0.25)',border:'1.5px solid #27272a',padding:'2rem',minWidth:'220px',textAlign:'center',flex:'1 1 220px',maxWidth:'340px'}}>
            <FaCheckCircle style={{color:'#22d3ee',fontSize:'2.2rem',marginBottom:'0.75rem'}} />
            <div style={{fontWeight:'bold',fontSize:'1.1rem',marginBottom:'0.5rem'}}>承認制</div>
            <div style={{color:'#e4e4e7',fontSize:'1rem'}}>GoogleまたはEmailログイン＋申請必須</div>
          </div>
          <div style={{background:'#232326',borderRadius:'1rem',boxShadow:'0 4px 24px rgba(0,0,0,0.25)',border:'1.5px solid #27272a',padding:'2rem',minWidth:'220px',textAlign:'center',flex:'1 1 220px',maxWidth:'340px'}}>
            <FaMoneyCheckAlt style={{color:'#fbbf24',fontSize:'2.2rem',marginBottom:'0.75rem'}} />
            <div style={{fontWeight:'bold',fontSize:'1.1rem',marginBottom:'0.5rem'}}>Zelleで一括支払い</div>
            <div style={{color:'#e4e4e7',fontSize:'1rem'}}>$49.9 / 3ヶ月</div>
          </div>
          <div style={{background:'#232326',borderRadius:'1rem',boxShadow:'0 4px 24px rgba(0,0,0,0.25)',border:'1.5px solid #27272a',padding:'2rem',minWidth:'220px',textAlign:'center',flex:'1 1 220px',maxWidth:'340px'}}>
            <FaLock style={{color:'#c92a2a',fontSize:'2.2rem',marginBottom:'0.75rem'}} />
            <div style={{fontWeight:'bold',fontSize:'1.1rem',marginBottom:'0.5rem'}}>外部共有は厳禁</div>
            <div style={{color:'#e4e4e7',fontSize:'1rem'}}>ログイン情報・内容の外部共有は<strong>厳禁</strong></div>
          </div>
        </div>
      </section>

      {/* ご利用までの流れ（完全インラインstyleステップ型） */}
      <section id="apply" style={{width:'100%',maxWidth:'900px',background:'#232326',borderRadius:'1rem',boxShadow:'0 4px 24px rgba(0,0,0,0.25)',border:'1.5px solid #27272a',padding:'2.5rem',margin:'0 auto 64px auto',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <h3 style={{fontSize:'1.4rem',fontWeight:'bold',color:'#fbbf24',display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'2rem'}}>
          <HiOutlineArrowRight style={{color:'#fbbf24',fontSize:'1.5rem'}} /> ご利用までの流れ
        </h3>
        <div style={{display:'flex',flexDirection:'row',gap:'32px',width:'100%',justifyContent:'center',flexWrap:'wrap',marginBottom:'2rem'}}>
          {/* ステップ1 */}
          <div style={{flex:'1 1 220px',maxWidth:'260px',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div style={{background:'#18181b',border:'4px solid #22d3ee',borderRadius:'9999px',boxShadow:'0 2px 12px rgba(0,0,0,0.18)',width:'64px',height:'64px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem',fontWeight:'bold',color:'#22d3ee',marginBottom:'0.75rem'}}>1</div>
            <div style={{color:'#e4e4e7',textAlign:'center',fontSize:'1rem'}}>Zelleで <strong>$49.9</strong> を一括zell送金<br /><span style={{fontSize:'0.9rem'}}>（送金先電話番号: 657-709-1289）</span></div>
          </div>
          {/* ステップ2 */}
          <div style={{flex:'1 1 220px',maxWidth:'260px',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div style={{background:'#18181b',border:'4px solid #22d3ee',borderRadius:'9999px',boxShadow:'0 2px 12px rgba(0,0,0,0.18)',width:'64px',height:'64px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem',fontWeight:'bold',color:'#22d3ee',marginBottom:'0.75rem'}}>2</div>
            <div style={{color:'#e4e4e7',textAlign:'center',fontSize:'1rem'}}>申請フォームに必要事項を記入</div>
          </div>
          {/* ステップ3 */}
          <div style={{flex:'1 1 220px',maxWidth:'260px',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div style={{background:'#18181b',border:'4px solid #22d3ee',borderRadius:'9999px',boxShadow:'0 2px 12px rgba(0,0,0,0.18)',width:'64px',height:'64px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem',fontWeight:'bold',color:'#22d3ee',marginBottom:'0.75rem'}}>3</div>
            <div style={{color:'#e4e4e7',textAlign:'center',fontSize:'1rem'}}>審査後、24時間以内に結果をご連絡</div>
          </div>
        </div>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeiKGlblgkAzjJmbVEno3L5lwWPiVt6ECZgt0OV9Ps6r6SRmw/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          style={{marginTop:'1rem',display:'inline-block',background:'linear-gradient(90deg,#2f9e44,#22d3ee)',color:'#fff',borderRadius:'9999px',padding:'1rem 2.5rem',fontSize:'1.1rem',fontWeight:'bold',boxShadow:'0 2px 12px rgba(0,0,0,0.18)',textDecoration:'none',transition:'transform 0.2s,box-shadow 0.2s'}}
        >
          申請フォームはこちら
        </a>
      </section>

      {/* ログイン・登録フォーム（カード型・モダンUI） */}
      <section style={{width:'100%',maxWidth:'420px',background:'#232326',borderRadius:'1.2rem',boxShadow:'0 4px 24px rgba(0,0,0,0.22)',border:'1.5px solid #27272a',padding:'2.5rem 2rem',margin:'0 auto 40px auto',display:'flex',flexDirection:'column',alignItems:'center',gap:'1.2rem'}}>
        <p style={{color:'#e4e4e7',marginBottom:'0.5rem',fontWeight:'bold',fontSize:'1.08rem',textAlign:'center'}}>すでに申請済みの方はこちらからログイン</p>
        <button
          onClick={loginWithGoogle}
          style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.7rem',background:'linear-gradient(90deg,#2f9e44,#22d3ee)',color:'#fff',borderRadius:'9999px',padding:'0.9rem 2.2rem',fontWeight:'bold',fontSize:'1.1rem',boxShadow:'0 2px 12px rgba(0,0,0,0.18)',border:'none',outline:'none',cursor:'pointer',marginBottom:'1.1rem',transition:'transform 0.2s,box-shadow 0.2s'}}
          onMouseOver={e=>{e.currentTarget.style.transform='scale(1.05)';e.currentTarget.style.boxShadow='0 6px 24px rgba(0,0,0,0.22)';}}
          onMouseOut={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.18)';}}
        >
          <FaGoogle style={{fontSize:'1.3em'}} /> Googleでログイン
        </button>
        <form style={{width:'100%',display:'flex',flexDirection:'column',gap:'0.7rem'}} onSubmit={e=>{e.preventDefault();handleEmailAuth();}}>
          <label htmlFor="email" style={{color:'#e4e4e7',fontWeight:'bold',marginBottom:'0.2rem',textAlign:'left'}}>メールアドレス</label>
          <input
            id="email"
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{width:'100%',padding:'0.9rem',borderRadius:'0.7rem',background:'#18181b',color:'#f4f4f5',border:'1.5px solid #27272a',fontSize:'1rem',marginBottom:'0.1rem',outline:'none',boxSizing:'border-box'}}
          />
          <label htmlFor="password" style={{color:'#e4e4e7',fontWeight:'bold',marginBottom:'0.2rem',textAlign:'left'}}>パスワード</label>
          <input
            id="password"
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{width:'100%',padding:'0.9rem',borderRadius:'0.7rem',background:'#18181b',color:'#f4f4f5',border:'1.5px solid #27272a',fontSize:'1rem',marginBottom:'0.1rem',outline:'none',boxSizing:'border-box'}}
          />
          <button
            type="submit"
            style={{width:'100%',background:'linear-gradient(90deg,#c92a2a,#fbbf24)',color:'#18181b',fontWeight:'bold',fontSize:'1.1rem',padding:'0.9rem',borderRadius:'9999px',boxShadow:'0 2px 12px rgba(0,0,0,0.18)',border:'none',outline:'none',marginTop:'0.7rem',marginBottom:'0.2rem',cursor:'pointer',transition:'transform 0.2s,box-shadow 0.2s'}}
            onMouseOver={e=>{e.currentTarget.style.transform='scale(1.03)';e.currentTarget.style.boxShadow='0 6px 24px rgba(0,0,0,0.22)';}}
            onMouseOut={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.18)';}}
          >
            {isRegistering ? "新規登録" : "ログイン"}
          </button>
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          style={{fontSize:'1rem',color:'#a5b4fc',background:'none',border:'none',textDecoration:'underline',marginTop:'0.5rem',cursor:'pointer',fontWeight:'bold',padding:'0.3rem 0.7rem',borderRadius:'0.5rem',transition:'color 0.2s'}}
          onMouseOver={e=>{e.currentTarget.style.color='#818cf8';}}
          onMouseOut={e=>{e.currentTarget.style.color='#a5b4fc';}}
        >
          {isRegistering ? "ログインへ切り替え" : "新規登録へ切り替え"}
        </button>
      </section>

      <footer className="text-[#a1a1aa] text-sm mt-10 mb-4">
        &copy; 2025 Kimuchi. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;






