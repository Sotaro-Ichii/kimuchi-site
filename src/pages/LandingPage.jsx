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
  FaGlobe,
  FaCrown,
  FaGem,
  FaAward,
  FaFire,
  FaMagic
} from 'react-icons/fa';
import { HiOutlineArrowRight, HiOutlineSparkles, HiOutlineStar } from 'react-icons/hi';

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
    console.log('Demo login button clicked');
    try {
      navigate("/home");
    } catch (error) {
      console.log('Navigate failed, using window.location');
      window.location.href = "/home";
    }
  };

  // フッターリンク用の関数
  const handleLegalClick = () => {
    console.log('Legal button clicked');
    try {
      navigate("/legal");
    } catch (error) {
      console.log('Navigate failed, using window.location');
      window.location.href = "/legal";
    }
  };

  const handleContactClick = () => {
    console.log('Contact button clicked');
    try {
      navigate("/contact");
    } catch (error) {
      console.log('Navigate failed, using window.location');
      window.location.href = "/contact";
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 25%, #e6f3ff 50%, #cce7ff 75%, #b3d9ff 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    }}>
      {/* 背景装飾 */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '40px',
          width: '128px',
          height: '128px',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '50%',
          filter: 'blur(24px)',
          animation: 'pulse 2s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '160px',
          right: '80px',
          width: '96px',
          height: '96px',
          backgroundColor: 'rgba(37, 99, 235, 0.15)',
          borderRadius: '50%',
          filter: 'blur(16px)',
          animation: 'bounce 2s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '80px',
          width: '160px',
          height: '160px',
          backgroundColor: 'rgba(29, 78, 216, 0.1)',
          borderRadius: '50%',
          filter: 'blur(24px)',
          animation: 'pulse 2s ease-in-out infinite 1s'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '160px',
          right: '40px',
          width: '112px',
          height: '112px',
          backgroundColor: 'rgba(30, 64, 175, 0.12)',
          borderRadius: '50%',
          filter: 'blur(16px)',
          animation: 'bounce 2s ease-in-out infinite 0.5s'
        }}></div>
      </div>

      {/* ヒーローセクション */}
      <section style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 16px',
        textAlign: 'center'
      }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* ロゴとタイトル */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src="/logo.png" 
                  alt="Musashi logo" 
                  style={{
                    width: '96px',
                    height: '96px',
                    margin: '0 auto 16px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                    animation: 'float 3s ease-in-out infinite'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'bounce 2s ease-in-out infinite',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}>
                  <HiOutlineSparkles style={{ color: 'white', fontSize: '14px' }} />
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '-8px',
                  width: '24px',
                  height: '24px',
                  background: 'linear-gradient(to right, #1e40af, #1d4ed8)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulse 2s ease-in-out infinite',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}>
                  <FaGem style={{ color: 'white', fontSize: '12px' }} />
                </div>
              </div>
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1e40af',
              marginBottom: '16px',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              background: 'linear-gradient(45deg, #1e40af, #3b82f6, #1e40af)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 2s ease-in-out infinite'
            }}>
              Musashi
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <FaCrown style={{ color: '#fbbf24', fontSize: '24px', animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{
                color: '#fbbf24',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>Premium Community</span>
              <FaCrown style={{ color: '#fbbf24', fontSize: '24px', animation: 'pulse 2s ease-in-out infinite' }} />
            </div>
            <p style={{
              fontSize: '18px',
              marginBottom: '32px',
              fontWeight: '500',
              lineHeight: '1.8',
              maxWidth: '800px',
              margin: '0 auto 32px',
              color: '#1e293b',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              とある大学の、<span style={{ fontWeight: 'bold', color: '#1e40af' }}>完全非公開</span>の授業評価コミュニティ。<br />
              編入成功者たちからの楽単情報を、<span style={{ fontWeight: 'bold', color: '#1e40af' }}>圧倒的に安い入会金</span>で手に入れることができます。
            </p>
          </div>
          
          {/* 会員数表示 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '50px',
            padding: '20px 32px',
            marginBottom: '40px',
            color: '#1e40af',
            fontWeight: 'bold',
            width: 'fit-content',
            margin: '0 auto 40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}>
            <FaUsers style={{ fontSize: '24px' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '24px' }}>{approvedUserCount}</span>
            <span style={{ fontSize: '20px' }}>名が参加中</span>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#22c55e',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}></div>
            <FaFire style={{ color: '#fb923c', fontSize: '24px', animation: 'pulse 2s ease-in-out infinite' }} />
          </div>
          
          {/* ログインフォーム */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(24px)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            marginBottom: '40px',
            maxWidth: '480px',
            margin: '0 auto 40px',
            transition: 'all 0.5s ease'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '32px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}>
                <FaUserShield style={{ color: 'white', fontSize: '24px' }} />
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #1e40af, #1d4ed8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>ログイン / 登録</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="メールアドレス"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '16px',
                    fontSize: '16px',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}>
                  <FaGlobe style={{ color: '#9ca3af', fontSize: '18px' }} />
                </div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="パスワード"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '16px',
                    fontSize: '16px',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}>
                  <FaLock style={{ color: '#9ca3af', fontSize: '18px' }} />
                </div>
              </div>
              
              <button
                onClick={handleEmailAuth}
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #1e40af, #1d4ed8)',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <FaMagic style={{ fontSize: '18px' }} />
                  {isRegistering ? "登録" : "ログイン"}
                </div>
              </button>
              
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                style={{
                  width: '100%',
                  color: '#1e40af',
                  fontSize: '14px',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
              >
                {isRegistering ? "既にアカウントをお持ちの方はこちら" : "新規登録はこちら"}
              </button>
              
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '100%',
                    borderTop: '2px solid #e5e7eb'
                  }}></div>
                </div>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>
                  <span style={{
                    padding: '0 16px',
                    backgroundColor: 'white',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>または</span>
                </div>
              </div>
              
              <button
                onClick={loginWithGoogle}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb',
                  color: '#374151',
                  padding: '16px',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <FaGoogle style={{ color: '#ef4444', fontSize: '20px' }} />
                Googleでログイン
              </button>
            </div>
          </div>
          
          {/* CTAボタン */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '48px'
          }}>
            <a
              href="https://form.run/@musashi"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '16px',
                background: 'linear-gradient(to right, #1e40af, #1d4ed8)',
                color: 'white',
                borderRadius: '50px',
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: 'bold',
                textDecoration: 'none',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              <FaRocket style={{ fontSize: '20px' }} />
              まずは申請する 
              <FaArrowRight style={{ fontSize: '18px' }} />
            </a>
            <button
              onClick={handleDemoLogin}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
                color: 'white',
                borderRadius: '50px',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <FaStar style={{ fontSize: '18px' }} />
              デモ体験（ゲスト）
            </button>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        marginBottom: '80px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(24px)',
            borderRadius: '24px',
            padding: '32px',
            textAlign: 'center',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            transition: 'all 0.5s ease'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}>
              <FaGraduationCap style={{ color: 'white', fontSize: '32px' }} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>先輩直伝の情報</h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>実際に現地で学んだ先輩たちからの最新・リアルな授業情報</p>
            <div style={{
              marginTop: '24px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <FaAward style={{ color: '#fbbf24', fontSize: '24px', animation: 'pulse 2s ease-in-out infinite' }} />
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(24px)',
            borderRadius: '24px',
            padding: '32px',
            textAlign: 'center',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            transition: 'all 0.5s ease'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(to right, #1e40af, #1d4ed8)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}>
              <FaHandshake style={{ color: 'white', fontSize: '32px' }} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>信頼できるコミュニティ</h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>厳選されたメンバーによる質の高い情報交換</p>
            <div style={{
              marginTop: '24px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <FaShieldAlt style={{ color: '#22c55e', fontSize: '24px', animation: 'pulse 2s ease-in-out infinite' }} />
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(24px)',
            borderRadius: '24px',
            padding: '32px',
            textAlign: 'center',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            transition: 'all 0.5s ease'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(to right, #22c55e, #059669)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}>
              <FaMoneyCheckAlt style={{ color: 'white', fontSize: '32px' }} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>圧倒的なコストパフォーマンス</h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>留学エージェントの何十分の一の価格で貴重な情報を入手</p>
            <div style={{
              marginTop: '24px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <FaFire style={{ color: '#fb923c', fontSize: '24px', animation: 'pulse 2s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      </section>

      {/* SNSシェアボタン */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '80px',
        padding: '0 16px'
      }}>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Musashi｜先輩直伝の楽単・授業情報コミュニティ')}&url=${encodeURIComponent(window.location.origin)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'linear-gradient(to right, #55acee, #5978a5)',
            color: 'white',
            borderRadius: '50px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
          }}
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 5.924c-.793.352-1.645.59-2.54.697a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 11.07 9.03c0 .352.04.695.116 1.022C7.728 9.89 4.1 8.1 1.67 5.149a4.48 4.48 0 0 0-.606 2.254c0 1.555.792 2.927 2.002 3.732a4.48 4.48 0 0 1-2.03-.561v.057a4.48 4.48 0 0 0 3.6 4.393c-.193.053-.397.082-.607.082-.148 0-.292-.014-.432-.04a4.48 4.48 0 0 0 4.18 3.11A8.98 8.98 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.017c8.26 0 12.78-6.84 12.78-12.78 0-.195-.004-.39-.013-.583A9.14 9.14 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.697z"/></svg>
          Xでシェア
        </a>
        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.origin)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'linear-gradient(to right, #00c300, #00a800)',
            color: 'white',
            borderRadius: '50px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
          }}
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184C17.413 1.13 14.13.013 10.66.013 4.77.013 0 4.13 0 9.22c0 2.92 1.68 5.53 4.36 7.23-.18.62-.98 3.36-1.02 3.56 0 .01-.01.05.02.07.03.02.07.01.08.01.11-.02 3.52-2.32 4.13-2.7.97.14 1.97.22 3.08.22 5.89 0 10.66-4.12 10.66-9.21 0-2.19-1.09-4.25-3.13-6.18z"/></svg>
          LINEでシェア
        </a>
        <a
          href="https://www.instagram.com/musashi.official/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'linear-gradient(to right, #e1306c, #833ab4)',
            color: 'white',
            borderRadius: '50px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
          }}
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.782 2.295 7.148 2.233 8.414 2.175 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.213 2.092-1.272 3.373C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.613.059 1.281.292 2.393 1.272 3.373.98.98 2.092 1.213 3.373 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.292 3.373-1.272.98-.98 1.213-2.092 1.272-3.373.059-1.281.072-1.69.072-7.613 0-5.923-.013-6.332-.072-7.613-.059-1.281-.292-2.393-1.272-3.373-.98-.98-2.092-1.213-3.373-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
          Instagramでシェア
        </a>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.origin);
              alert('URLをコピーしました！');
            } catch (err) {
              // フォールバック: 古いブラウザ対応
              const textArea = document.createElement('textarea');
              textArea.value = window.location.origin;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);
              alert('URLをコピーしました！');
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'linear-gradient(to right, #4b5563, #374151)',
            color: 'white',
            borderRadius: '50px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
          }}
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          URLコピー
        </button>
      </div>

      {/* なぜMusashiなのかセクション */}
      <section style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        marginBottom: '80px'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(24px)',
          borderRadius: '24px',
          padding: '32px',
          textAlign: 'center',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          transition: 'all 0.5s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}>
              <FaLightbulb style={{ color: 'white', fontSize: '32px' }} />
            </div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>なぜMusashiなのか？</h2>
          </div>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.8',
            maxWidth: '800px',
            margin: '0 auto 32px',
            color: '#374151'
          }}>
            他に同じようなサービスは存在しません。<br />
            留学エージェントに何十万円も支払うよりも、実際に現地で学んだ先輩たちから最新・リアルな授業情報や体験談を、<span style={{ fontWeight: 'bold', color: '#a855f7' }}>圧倒的に安い入会金</span>で手に入れることができます。<br />
            Musashiは、信頼できるコミュニティだからこそ、ネットやSNSでは得られない<span style={{ fontWeight: 'bold', color: '#3b82f6' }}>「本当に役立つ情報」</span>だけを厳選して提供しています。
          </p>
        </div>
      </section>

      {/* 会員の声セクション */}
      <section style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        marginBottom: '80px'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(24px)',
          borderRadius: '24px',
          padding: '32px',
          textAlign: 'center',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          transition: 'all 0.5s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(to right, #ef4444, #ec4899)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}>
              <FaHeart style={{ color: 'white', fontSize: '32px' }} />
            </div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #ef4444, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>会員の声</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: '24px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                color: '#fbbf24',
                fontSize: '32px',
                marginBottom: '24px'
              }}>★★★★★</div>
              <p style={{
                fontSize: '16px',
                color: '#374151',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}>"先輩の体験談が本当に役立ちました！"</p>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>- 匿名会員</p>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: '24px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                color: '#fbbf24',
                fontSize: '32px',
                marginBottom: '24px'
              }}>★★★★★</div>
              <p style={{
                fontSize: '16px',
                color: '#374151',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}>"楽単情報で単位取得が楽になりました"</p>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>- 編入生A</p>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: '24px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                color: '#fbbf24',
                fontSize: '32px',
                marginBottom: '24px'
              }}>★★★★★</div>
              <p style={{
                fontSize: '16px',
                color: '#374151',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}>"コミュニティがとても温かいです"</p>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>- 留学生B</p>
            </div>
          </div>
        </div>
      </section>

      {/* よくある質問セクション */}
      <section style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        marginBottom: '80px'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(24px)',
          borderRadius: '24px',
          padding: '32px',
          textAlign: 'center',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          transition: 'all 0.5s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(to right, #22c55e, #059669)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}>
              <FaShieldAlt style={{ color: 'white', fontSize: '32px' }} />
            </div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #22c55e, #059669)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>よくある質問</h2>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: '24px',
              padding: '24px',
              textAlign: 'left',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px'
              }}>Q: 入会金はいくらですか？</h3>
              <p style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6'
              }}>A: 現在特別価格で$50です。通常価格より大幅に割引しています。</p>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: '24px',
              padding: '24px',
              textAlign: 'left',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px'
              }}>Q: どのような情報が得られますか？</h3>
              <p style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6'
              }}>A: 楽単情報、授業評価、教授の特徴、試験対策など、実際の体験談を中心とした情報を提供しています。</p>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: '24px',
              padding: '24px',
              textAlign: 'left',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px'
              }}>Q: 退会はいつでもできますか？</h3>
              <p style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6'
              }}>A: はい、いつでも退会可能です。ただし、入会金の返金はできません。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 申請フォームセクション */}
      <section style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        marginBottom: '80px'
      }}>
        <div style={{
          background: 'linear-gradient(to right, #1e40af, #1d4ed8)',
          borderRadius: '24px',
          padding: '32px',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
          }}></div>
          <div style={{
            position: 'relative',
            zIndex: 10
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}>
                <FaRocket style={{ color: 'white', fontSize: '32px' }} />
              </div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold'
              }}>今すぐ申請する</h2>
            </div>
            <p style={{
              fontSize: '18px',
              marginBottom: '32px',
              color: 'white',
              maxWidth: '800px',
              margin: '0 auto 32px'
            }}>限定価格で先輩たちの貴重な情報を手に入れましょう</p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              justifyContent: 'center'
            }}>
              <a
                href="https://form.run/@musashi"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'white',
                  color: '#1e40af',
                  padding: '16px 32px',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                申請フォームへ
              </a>
              <button 
                onClick={handleDemoLogin}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  border: '2px solid white',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                デモ体験
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '48px 16px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <p style={{
            fontSize: '16px',
            color: '#d1d5db',
            marginBottom: '24px'
          }}>© 2024 Musashi. All rights reserved.</p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            fontSize: '16px'
          }}>
            <button 
              onClick={handleLegalClick}
              style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid transparent',
                backgroundColor: 'transparent',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#ffffff';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#d1d5db';
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'transparent';
              }}
            >
              利用規約
            </button>
            <button 
              onClick={handleContactClick}
              style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid transparent',
                backgroundColor: 'transparent',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#ffffff';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#d1d5db';
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'transparent';
              }}
            >
              お問い合わせ
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;






