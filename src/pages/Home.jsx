import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  db, auth, loginWithGoogle, loginAnonymously, logout, onAuthChange
} from '../firebase';
import {
  collection, getDocs, addDoc, query, orderBy, Timestamp
} from 'firebase/firestore';
import { 
  FaSearch, FaComment, FaPlus, FaUser, FaSignOutAlt, FaGoogle, FaUserSecret,
  FaBook, FaGraduationCap, FaLightbulb, FaEnvelope, FaArrowRight
} from 'react-icons/fa';

function normalize(text) {
  if (typeof text !== 'string') return '';
  return text.toLowerCase().replace(/\s+/g, '');
}

function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [courses, setCourses] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentCourseId, setCommentCourseId] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newProfessor, setNewProfessor] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [resultCourses, setResultCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('search'); // search, comments, submit

  useEffect(() => {
    fetchCourses();
    fetchComments();
    onAuthChange(setUser);
  }, []);

  const fetchCourses = async () => {
    const snapshot = await getDocs(collection(db, 'courses'));
    setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchComments = async () => {
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const normalized = normalize(searchInput);
    setResultCourses(courses.filter(c => normalize(c.name).includes(normalized)));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText || !commentCourseId) return;
    await addDoc(collection(db, 'comments'), {
      name: commentName || (user?.isAnonymous ? '匿名' : user?.displayName || 'ユーザー'),
      text: commentText,
      courseId: commentCourseId,
      timestamp: Timestamp.now()
    });
    setCommentText('');
    setCommentName('');
    setCommentCourseId('');
    fetchComments();
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    const id = `${normalize(newCourseName)}-${normalize(newProfessor)}`;
    await addDoc(collection(db, 'courses'), {
      name: newCourseName,
      professor: newProfessor,
      description: newDescription,
      id
    });
    setNewCourseName('');
    setNewProfessor('');
    setNewDescription('');
    fetchCourses();
  };

  return (
    <div style={{ 
      backgroundColor: '#18181b', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: 'Inter, sans-serif',
      color: '#f4f4f5'
    }}>
      {/* ヘッダー */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px 0'
      }}>
        {/* ユーザー情報・ログイン */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          padding: '20px',
          background: '#232326',
          borderRadius: '16px',
          border: '1.5px solid #27272a',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fbbf24, #f59e42)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#18181b',
              fontWeight: 'bold'
            }}>
              <FaUser />
            </div>
            <div>
              <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '1.1rem' }}>
                {user ? (user.isAnonymous ? '匿名ユーザー' : user.displayName || 'ユーザー') : 'ゲスト'}
              </div>
              <div style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
                {user ? 'ログイン中' : 'ログインしてください'}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            {user ? (
              <button 
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, #c92a2a, #dc2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.target.style.transform = 'scale(1)'}
              >
                <FaSignOutAlt /> ログアウト
              </button>
            ) : (
              <>
                <button 
                  onClick={loginWithGoogle}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, #2f9e44, #22d3ee)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.target.style.transform = 'scale(1)'}
                >
                  <FaGoogle /> Googleログイン
                </button>
                <button 
                  onClick={loginAnonymously}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.target.style.transform = 'scale(1)'}
                >
                  <FaUserSecret /> 匿名ログイン
                </button>
              </>
            )}
          </div>
        </div>

        {/* メインタイトル */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <h1 style={{ 
            color: '#fbbf24', 
            fontSize: '3.5rem', 
            fontWeight: 'bold',
            marginBottom: '16px',
            textShadow: '0 4px 20px rgba(251, 191, 36, 0.3)'
          }}>
            Kimuchi
          </h1>
          <p style={{ 
            fontSize: '1.3rem', 
            color: '#a1a1aa',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            楽単情報プラットフォームへようこそ
          </p>
        </div>

        {/* タブナビゲーション */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'search', icon: <FaSearch />, label: '授業検索' },
            { id: 'comments', icon: <FaComment />, label: 'コメント一覧' },
            { id: 'submit', icon: <FaPlus />, label: '投稿・提案' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #fbbf24, #f59e42)' 
                  : '#232326',
                color: activeTab === tab.id ? '#18181b' : '#e4e4e7',
                border: '1.5px solid',
                borderColor: activeTab === tab.id ? '#fbbf24' : '#27272a',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => activeTab !== tab.id && (e.target.style.background = '#27272a')}
              onMouseOut={e => activeTab !== tab.id && (e.target.style.background = '#232326')}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* タブコンテンツ */}
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* 授業検索タブ */}
          {activeTab === 'search' && (
            <div style={{
              background: '#232326',
              borderRadius: '20px',
              padding: '40px',
              border: '1.5px solid #27272a',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{ 
                color: '#22d3ee', 
                fontSize: '2rem', 
                fontWeight: 'bold',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <FaSearch /> 授業を検索
              </h2>

              <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  maxWidth: '600px',
                  margin: '0 auto',
                  ...(window.innerWidth <= 600 && { flexDirection: 'column' })
                }}>
                  <input
                    type="text"
                    placeholder="授業名を検索（例：econ 170）"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    style={{
                      flex: '1',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: '1.5px solid #27272a',
                      background: '#18181b',
                      color: '#f4f4f5',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#22d3ee'}
                    onBlur={(e) => e.target.style.borderColor = '#27272a'}
                  />
                  <button style={{
                    padding: '16px 24px',
                    background: 'linear-gradient(135deg, #2f9e44, #22d3ee)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.target.style.transform = 'scale(1)'}
                  >
                    検索
                  </button>
                </div>
              </form>

              {resultCourses.length > 0 && (
                <div>
                  <h3 style={{ 
                    color: '#fbbf24', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <FaBook /> 検索結果（{resultCourses.length}件）
                  </h3>
                  <div style={{
                    display: 'grid',
                    gap: '16px',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
                  }}>
                    {resultCourses.map(course => (
                      <div key={course.id} style={{
                        background: '#18181b',
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1.5px solid #27272a',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s'
                      }}
                      onMouseOver={e => e.target.style.transform = 'scale(1.02)'}
                      onMouseOut={e => e.target.style.transform = 'scale(1)'}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '12px'
                        }}>
                          <FaGraduationCap style={{ color: '#22d3ee', fontSize: '1.2rem' }} />
                          <strong style={{ color: '#fbbf24', fontSize: '1.1rem' }}>{course.name}</strong>
                        </div>
                        <div style={{ color: '#e4e4e7', marginBottom: '8px' }}>
                          <strong>教授:</strong> {course.professor}
                        </div>
                        <div style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.5' }}>
                          {course.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* コメント一覧タブ */}
          {activeTab === 'comments' && (
            <div style={{
              background: '#232326',
              borderRadius: '20px',
              padding: '40px',
              border: '1.5px solid #27272a',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{ 
                color: '#22d3ee', 
                fontSize: '2rem', 
                fontWeight: 'bold',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <FaComment /> 全体コメント一覧
              </h2>

              <div style={{
                display: 'grid',
                gap: '16px',
                maxHeight: '600px',
                overflowY: 'auto',
                paddingRight: '8px'
              }}>
                {comments.map(comment => (
                  <div key={comment.id} style={{
                    background: '#18181b',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1.5px solid #27272a',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaUser style={{ color: '#fbbf24', fontSize: '1rem' }} />
                        <strong style={{ color: '#fbbf24' }}>
                          {comment.name || "匿名"}
                        </strong>
                      </div>
                      <div style={{
                        background: '#27272a',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        color: '#a1a1aa'
                      }}>
                        {comment.courseId}
                      </div>
                    </div>
                    <div style={{ 
                      color: '#e4e4e7', 
                      lineHeight: '1.6',
                      fontSize: '1rem'
                    }}>
                      {comment.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 投稿・提案タブ */}
          {activeTab === 'submit' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              ...(window.innerWidth <= 900 && { gridTemplateColumns: '1fr', gap: '30px' })
            }}>
              {/* コメント投稿 */}
              <div style={{
                background: '#232326',
                borderRadius: '20px',
                padding: '40px',
                border: '1.5px solid #27272a',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}>
                <h2 style={{ 
                  color: '#22d3ee', 
                  fontSize: '1.8rem', 
                  fontWeight: 'bold',
                  marginBottom: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <FaComment /> コメント投稿
                </h2>

                <form onSubmit={handleCommentSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600',
                      color: '#e4e4e7'
                    }}>
                      お名前（任意）
                    </label>
                    <input
                      type="text"
                      placeholder="あなたの名前"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #27272a',
                        background: '#18181b',
                        color: '#f4f4f5',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#22d3ee'}
                      onBlur={(e) => e.target.style.borderColor = '#27272a'}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600',
                      color: '#e4e4e7'
                    }}>
                      対象の授業ID *
                    </label>
                    <input
                      type="text"
                      placeholder="例：econ170-davisscott"
                      value={commentCourseId}
                      onChange={(e) => setCommentCourseId(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #27272a',
                        background: '#18181b',
                        color: '#f4f4f5',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#22d3ee'}
                      onBlur={(e) => e.target.style.borderColor = '#27272a'}
                    />
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600',
                      color: '#e4e4e7'
                    }}>
                      コメント内容 *
                    </label>
                    <textarea
                      rows="4"
                      placeholder="授業の感想や評価を書いてください"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #27272a',
                        background: '#18181b',
                        color: '#f4f4f5',
                        fontSize: '1rem',
                        outline: 'none',
                        resize: 'vertical',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#22d3ee'}
                      onBlur={(e) => e.target.style.borderColor = '#27272a'}
                    />
                  </div>

                  <button style={{
                    width: '100%',
                    padding: '16px 24px',
                    background: 'linear-gradient(135deg, #c92a2a, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={e => e.target.style.transform = 'scale(1.02)'}
                  onMouseOut={e => e.target.style.transform = 'scale(1)'}
                  >
                    投稿する
                  </button>
                </form>
              </div>

              {/* 楽単授業提案 */}
              <div style={{
                background: '#232326',
                borderRadius: '20px',
                padding: '40px',
                border: '1.5px solid #27272a',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}>
                <h2 style={{ 
                  color: '#22d3ee', 
                  fontSize: '1.8rem', 
                  fontWeight: 'bold',
                  marginBottom: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <FaLightbulb /> 楽単授業を提案
                </h2>

                <form onSubmit={handleAddCourse}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600',
                      color: '#e4e4e7'
                    }}>
                      教科名 *
                    </label>
                    <input
                      type="text"
                      placeholder="例：Econ 170"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #27272a',
                        background: '#18181b',
                        color: '#f4f4f5',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#22d3ee'}
                      onBlur={(e) => e.target.style.borderColor = '#27272a'}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600',
                      color: '#e4e4e7'
                    }}>
                      教授名 *
                    </label>
                    <input
                      type="text"
                      placeholder="例：Davis Scott"
                      value={newProfessor}
                      onChange={(e) => setNewProfessor(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #27272a',
                        background: '#18181b',
                        color: '#f4f4f5',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#22d3ee'}
                      onBlur={(e) => e.target.style.borderColor = '#27272a'}
                    />
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600',
                      color: '#e4e4e7'
                    }}>
                      授業の説明 *
                    </label>
                    <textarea
                      rows="4"
                      placeholder="授業の内容や楽単ポイントを説明してください"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #27272a',
                        background: '#18181b',
                        color: '#f4f4f5',
                        fontSize: '1rem',
                        outline: 'none',
                        resize: 'vertical',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#22d3ee'}
                      onBlur={(e) => e.target.style.borderColor = '#27272a'}
                    />
                  </div>

                  <button style={{
                    width: '100%',
                    padding: '16px 24px',
                    background: 'linear-gradient(135deg, #22d3ee, #6366f1)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={e => e.target.style.transform = 'scale(1.02)'}
                  onMouseOut={e => e.target.style.transform = 'scale(1)'}
                  >
                    提案を送信
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <footer style={{ 
          marginTop: '80px', 
          borderTop: '1px solid #27272a', 
          paddingTop: '30px', 
          textAlign: 'center',
          color: '#a1a1aa'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <Link to="/legal" style={{ 
              color: '#a1a1aa', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.2s'
            }}
            onMouseOver={e => e.target.style.color = '#fbbf24'}
            onMouseOut={e => e.target.style.color = '#a1a1aa'}
            >
              <FaEnvelope /> 法的事項
            </Link>
            <Link to="/contact" style={{ 
              color: '#a1a1aa', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.2s'
            }}
            onMouseOver={e => e.target.style.color = '#fbbf24'}
            onMouseOut={e => e.target.style.color = '#a1a1aa'}
            >
              <FaEnvelope /> お問い合わせ
            </Link>
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            &copy; 2025 Kimuchi. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;











