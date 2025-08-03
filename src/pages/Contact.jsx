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
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '24px 16px',
      fontFamily: 'sans-serif',
      color: '#1e293b'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: '32px' }}>
          <Link 
            to="/" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '24px',
              transition: 'color 0.3s ease'
            }}
          >
            <FaArrowLeft /> ホームに戻る
          </Link>

          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#2563eb',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            お問い合わせ
          </h1>
          <p style={{
            fontSize: '18px',
            textAlign: 'center',
            color: '#64748b',
            marginBottom: '32px'
          }}>
            ご質問・ご要望・バグ報告など、お気軽にお問い合わせください
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* 左側：お問い合わせフォーム */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2563eb',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <FaEnvelope /> メッセージを送信
            </h2>

            {submitStatus === 'success' && (
              <div style={{
                backgroundColor: '#059669',
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#1e293b',
                  fontSize: '16px'
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
                    border: '1px solid #cbd5e1',
                    backgroundColor: 'white',
                    color: '#1e293b',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#1e293b',
                  fontSize: '16px'
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
                    border: '1px solid #cbd5e1',
                    backgroundColor: 'white',
                    color: '#1e293b',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#1e293b',
                  fontSize: '16px'
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
                    border: '1px solid #cbd5e1',
                    backgroundColor: 'white',
                    color: '#1e293b',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#1e293b',
                  fontSize: '16px'
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
                    border: '1px solid #cbd5e1',
                    backgroundColor: 'white',
                    color: '#1e293b',
                    fontSize: '16px',
                    resize: 'vertical',
                    transition: 'border-color 0.3s ease'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {isSubmitting ? '送信中...' : '送信する'}
              </button>
            </form>
          </div>

          {/* 右側：連絡先情報 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2563eb',
              marginBottom: '24px'
            }}>
              連絡先情報
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                backgroundColor: '#f1f5f9',
                borderRadius: '12px'
              }}>
                <FaEnvelope style={{ color: '#2563eb', fontSize: '20px' }} />
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '4px'
                  }}>
                    メールアドレス
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    sotta.san17@gmail.com
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                backgroundColor: '#f1f5f9',
                borderRadius: '12px'
              }}>
                <FaGithub style={{ color: '#2563eb', fontSize: '20px' }} />
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '4px'
                  }}>
                    GitHub
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    プロジェクトの詳細はこちら
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '32px',
              padding: '24px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              border: '1px solid #f59e0b'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#92400e',
                marginBottom: '12px'
              }}>
                お問い合わせについて
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#92400e',
                lineHeight: '1.6'
              }}>
                通常24時間以内にご返信いたします。緊急の場合は、メールの件名に「緊急」と記載してください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact; 