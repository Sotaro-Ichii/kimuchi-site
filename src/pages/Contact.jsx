import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaGithub, FaArrowLeft } from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 実際のメール送信処理は後で実装
    // 現在は模擬的な処理
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  return (
    <div style={{ 
      backgroundColor: '#f1f5f9', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: 'Inter, sans-serif',
      color: '#1e293b'
    }}>
      {/* ヘッダー */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px 0'
      }}>
        <Link to="/home" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#2563eb',
          textDecoration: 'none',
          fontSize: '1rem',
          fontWeight: '600',
          marginBottom: '40px'
        }}>
          <FaArrowLeft /> ホームに戻る
        </Link>

        <h1 style={{ 
          color: '#2563eb', 
          fontSize: '3rem', 
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '10px'
        }}>
          お問い合わせ
        </h1>
        <p style={{ 
          textAlign: 'center', 
          fontSize: '1.2rem', 
          color: '#64748b',
          marginBottom: '60px'
        }}>
          ご質問・ご要望・バグ報告など、お気軽にお問い合わせください
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          maxWidth: '1000px',
          margin: '0 auto',
          ...(window.innerWidth <= 768 && { gridTemplateColumns: '1fr', gap: '40px' })
        }}>
          {/* 左側：お問い合わせフォーム */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '40px',
            border: '1.5px solid #cbd5e1',
            boxShadow: '0 8px 32px rgba(30,41,59,0.10)'
          }}>
            <h2 style={{ 
              color: '#2563eb', 
              fontSize: '1.8rem', 
              fontWeight: 'bold',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <FaEnvelope /> メッセージを送信
            </h2>

            {submitStatus === 'success' && (
              <div style={{
                background: '#2f9e44',
                color: 'white',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                お問い合わせを送信しました。ありがとうございます！
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  お名前 *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    background: '#fff',
                    color: '#1e293b',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  メールアドレス *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    background: '#fff',
                    color: '#1e293b',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  件名 *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    background: '#fff',
                    color: '#1e293b',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  メッセージ *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    background: '#fff',
                    color: '#1e293b',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: isSubmitting ? '#6366f1' : 'linear-gradient(90deg, #22d3ee, #6366f1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  opacity: isSubmitting ? 0.7 : 1
                }}
                onMouseOver={e => !isSubmitting && (e.target.style.transform = 'scale(1.02)')}
                onMouseOut={e => !isSubmitting && (e.target.style.transform = 'scale(1)')}
              >
                {isSubmitting ? '送信中...' : 'メッセージを送信'}
              </button>
            </form>
          </div>

          {/* 右側：連絡先情報 */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '40px',
            border: '1.5px solid #cbd5e1',
            boxShadow: '0 8px 32px rgba(30,41,59,0.10)',
            height: 'fit-content'
          }}>
            <h2 style={{ 
              color: '#2563eb', 
              fontSize: '1.8rem', 
              fontWeight: 'bold',
              marginBottom: '30px'
            }}>
              連絡先情報
            </h2>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                color: '#2563eb', 
                fontSize: '1.2rem', 
                fontWeight: '600',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FaEnvelope /> メール
              </h3>
              <p style={{ 
                color: '#1e293b', 
                fontSize: '1.1rem',
                marginBottom: '8px'
              }}>
                sotta.san17@gmail.com
              </p>
              <p style={{ 
                color: '#64748b', 
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                通常24時間以内に返信いたします
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                color: '#2563eb', 
                fontSize: '1.2rem', 
                fontWeight: '600',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FaPhone /> 電話番号
              </h3>
              <p style={{ 
                color: '#1e293b', 
                fontSize: '1.1rem',
                marginBottom: '8px'
              }}>
                657-709-1289
              </p>
              <p style={{ 
                color: '#64748b', 
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                緊急時のみ。平日9:00-18:00
              </p>
            </div>

            <div style={{
              background: '#f1f5f9',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #cbd5e1'
            }}>
              <h3 style={{ 
                color: '#2563eb', 
                fontSize: '1.1rem', 
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                よくある質問
              </h3>
              <ul style={{ 
                color: '#64748b', 
                fontSize: '0.95rem',
                lineHeight: '1.6',
                paddingLeft: '20px'
              }}>
                <li>アカウントの承認について</li>
                <li>支払い方法の変更</li>
                <li>バグ報告・改善提案</li>
                <li>新しい機能のリクエスト</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact; 