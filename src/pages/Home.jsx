import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  db, auth, loginWithGoogle, loginAnonymously, logout, onAuthChange
} from '../firebase';
import {
  collection, getDocs, addDoc, query, orderBy, Timestamp, doc, getDoc, setDoc, updateDoc, increment
} from 'firebase/firestore';
import { 
  FaSearch, FaComment, FaPlus, FaUser, FaSignOutAlt, FaGoogle, FaUserSecret,
  FaBook, FaGraduationCap, FaLightbulb, FaEnvelope, FaArrowRight, FaFilter,
  FaSort, FaCheck, FaTimes, FaUsers, FaStar, FaClock, FaThumbsUp, FaExternalLinkAlt
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function normalize(text) {
  if (typeof text !== 'string') return '';
  return text.toLowerCase().replace(/\s+/g, '');
}

function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [professorSearch, setProfessorSearch] = useState('');
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
  const [activeTab, setActiveTab] = useState('search');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [userEnrollments, setUserEnrollments] = useState({});
  const [courseStats, setCourseStats] = useState({});
  const navigate = useNavigate();
  const { userBadge } = useAuth();
  const [badgeCache, setBadgeCache] = useState({});

  useEffect(() => {
    fetchCourses();
    fetchComments();
    onAuthChange(setUser);
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserEnrollments();
    }
  }, [user]);

  useEffect(() => {
    fetchCourseStats();
  }, [courses]);

  const fetchCourses = async () => {
    const snapshot = await getDocs(collection(db, 'courses'));
    setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchComments = async () => {
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchUserEnrollments = async () => {
    if (!user) return;
    const userDoc = await getDoc(doc(db, 'userEnrollments', user.uid));
    if (userDoc.exists()) {
      setUserEnrollments(userDoc.data().enrolledCourses || {});
    }
  };

  const fetchCourseStats = async () => {
    const stats = {};
    for (const course of courses) {
      const statsDoc = await getDoc(doc(db, 'courseStats', course.id));
      if (statsDoc.exists()) {
        stats[course.id] = statsDoc.data();
      } else {
        stats[course.id] = { enrolledCount: 0, rating: 0, ratingCount: 0 };
      }
    }
    setCourseStats(stats);
  };

  const handleEnrollment = async (courseId) => {
    if (!user) {
      alert('ログインが必要です');
      return;
    }

    const isEnrolled = userEnrollments[courseId];
    const userRef = doc(db, 'userEnrollments', user.uid);
    const courseStatsRef = doc(db, 'courseStats', courseId);

    try {
      if (isEnrolled) {
        // 受講取り消し
        await updateDoc(userRef, {
          [`enrolledCourses.${courseId}`]: false
        });
        await updateDoc(courseStatsRef, {
          enrolledCount: increment(-1)
        });
        setUserEnrollments(prev => ({ ...prev, [courseId]: false }));
        setCourseStats(prev => ({
          ...prev,
          [courseId]: { ...prev[courseId], enrolledCount: prev[courseId].enrolledCount - 1 }
        }));
      } else {
        // 受講登録
        await setDoc(userRef, {
          enrolledCourses: { ...userEnrollments, [courseId]: true }
        }, { merge: true });
        await setDoc(courseStatsRef, {
          enrolledCount: increment(1)
        }, { merge: true });
        setUserEnrollments(prev => ({ ...prev, [courseId]: true }));
        setCourseStats(prev => ({
          ...prev,
          [courseId]: { ...prev[courseId], enrolledCount: prev[courseId].enrolledCount + 1 }
        }));
      }
    } catch (error) {
      console.error('受講登録エラー:', error);
      alert('エラーが発生しました');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const performSearch = () => {
    let filtered = [...courses];

    // 授業名検索
    if (searchInput.trim()) {
      const normalized = normalize(searchInput);
      filtered = filtered.filter(c => normalize(c.name).includes(normalized));
    }

    // 教授名検索
    if (professorSearch.trim()) {
      const normalized = normalize(professorSearch);
      filtered = filtered.filter(c => normalize(c.professor).includes(normalized));
    }

    // カテゴリフィルター
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => {
        const courseName = c.name.toLowerCase();
        if (selectedCategory === 'econ') return courseName.includes('econ');
        if (selectedCategory === 'math') return courseName.includes('math');
        if (selectedCategory === 'eng') return courseName.includes('eng');
        if (selectedCategory === 'sci') return courseName.includes('sci') || courseName.includes('bio') || courseName.includes('chem');
        if (selectedCategory === 'hum') return courseName.includes('hum') || courseName.includes('hist') || courseName.includes('phil');
        return true;
      });
    }

    // 並び替え
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'professor':
          return a.professor.localeCompare(b.professor);
        case 'enrolled':
          return (courseStats[b.id]?.enrolledCount || 0) - (courseStats[a.id]?.enrolledCount || 0);
        case 'recent':
          return (b.timestamp?.toDate?.() || 0) - (a.timestamp?.toDate?.() || 0);
        default:
          return 0;
      }
    });

    setResultCourses(filtered);
  };

  useEffect(() => {
    performSearch();
  }, [searchInput, professorSearch, selectedCategory, sortBy, courses, courseStats]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText || !commentCourseId) return;
    await addDoc(collection(db, 'comments'), {
      name: commentName || (user?.isAnonymous ? '匿名' : user?.displayName || 'ユーザー'),
      text: commentText,
      courseId: commentCourseId,
      timestamp: Timestamp.now(),
      uid: user?.uid || null
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
      id,
      timestamp: Timestamp.now()
    });
    setNewCourseName('');
    setNewProfessor('');
    setNewDescription('');
    fetchCourses();
  };

  const getCategoryColor = (category) => {
    const colors = {
      econ: '#22d3ee',
      math: '#fbbf24',
      eng: '#2f9e44',
      sci: '#c92a2a',
      hum: '#8b5cf6'
    };
    return colors[category] || '#6366f1';
  };

  const getCategoryName = (courseName) => {
    const name = courseName.toLowerCase();
    if (name.includes('econ')) return 'econ';
    if (name.includes('math')) return 'math';
    if (name.includes('eng')) return 'eng';
    if (name.includes('sci') || name.includes('bio') || name.includes('chem')) return 'sci';
    if (name.includes('hum') || name.includes('hist') || name.includes('phil')) return 'hum';
    return 'other';
  };

  // コメント投稿者のバッジを取得（uidベース）
  const getBadgeForUid = async (uid) => {
    if (!uid) return 'Member';
    if (badgeCache[uid]) return badgeCache[uid];
    try {
      const badgeDoc = await getDoc(doc(db, 'userBadges', uid));
      const badge = badgeDoc.exists() ? badgeDoc.data().badge : 'Member';
      setBadgeCache((prev) => ({ ...prev, [uid]: badge }));
      return badge;
    } catch {
      setBadgeCache((prev) => ({ ...prev, [uid]: 'Member' }));
      return 'Member';
    }
  };

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', color: '#1e293b' }}>
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
              <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user ? (user.isAnonymous ? '匿名ユーザー' : user.displayName || 'ユーザー') : 'ゲスト'}
                {/* バッジ表示 */}
                <span style={{
                  background: userBadge === 'Gold' ? '#fbbf24' : userBadge === 'Founder' ? '#8b5cf6' : '#22d3ee',
                  color: '#18181b',
                  borderRadius: '8px',
                  padding: '2px 10px',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  marginLeft: '4px',
                  letterSpacing: '0.03em',
                  border: '1.5px solid #27272a',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.10)'
                }}>
                  {userBadge}
                </span>
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
            color: '#2563eb', 
            fontSize: '3.5rem', 
            fontWeight: 'bold',
            marginBottom: '16px',
            textShadow: '0 4px 20px rgba(37, 99, 235, 0.3)'
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
                  ? 'linear-gradient(135deg, #2563eb, #1e40af)' 
                  : '#232326',
                color: activeTab === tab.id ? '#18181b' : '#e4e4e7',
                border: '1.5px solid',
                borderColor: activeTab === tab.id ? '#2563eb' : '#27272a',
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
          maxWidth: '1200px',
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
                color: '#2563eb', 
                fontSize: '2rem', 
                fontWeight: 'bold',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <FaSearch /> 授業を検索
              </h2>

              {/* 検索フォーム */}
              <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '20px',
                  ...(window.innerWidth <= 768 && { gridTemplateColumns: '1fr' })
                }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600',
                      color: '#e4e4e7'
                    }}>
                      授業名で検索
                    </label>
                    <input
                      type="text"
                      placeholder="授業名を検索（例：econ 170）"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        border: '1.5px solid #27272a',
                        background: '#18181b',
                        color: '#f4f4f5',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                      onBlur={(e) => e.target.style.borderColor = '#27272a'}
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600',
                      color: '#e4e4e7'
                    }}>
                      教授名で検索
                    </label>
                    <input
                      type="text"
                      placeholder="教授名を検索（例：Davis）"
                      value={professorSearch}
                      onChange={(e) => setProfessorSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        border: '1.5px solid #27272a',
                        background: '#18181b',
                        color: '#f4f4f5',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                      onBlur={(e) => e.target.style.borderColor = '#27272a'}
                    />
                  </div>
                </div>

                {/* フィルター・並び替え */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      background: '#27272a',
                      color: '#e4e4e7',
                      border: '1.5px solid #27272a',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.target.style.background = '#3f3f46'}
                    onMouseOut={e => e.target.style.background = '#27272a'}
                  >
                    <FaFilter /> フィルター
                  </button>

                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        padding: '12px 16px',
                        background: '#18181b',
                        color: '#f4f4f5',
                        border: '1.5px solid #27272a',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="name">授業名順</option>
                      <option value="professor">教授名順</option>
                      <option value="enrolled">受講者数順</option>
                      <option value="recent">最近追加順</option>
                    </select>
                  </div>
                </div>

                {/* フィルターオプション */}
                {showFilters && (
                  <div style={{
                    background: '#18181b',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    border: '1px solid #27272a'
                  }}>
                    <h3 style={{ 
                      color: '#2563eb', 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold',
                      marginBottom: '16px'
                    }}>
                      カテゴリフィルター
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}>
                      {[
                        { value: 'all', label: 'すべて', color: '#6366f1' },
                        { value: 'econ', label: '経済学', color: '#22d3ee' },
                        { value: 'math', label: '数学', color: '#fbbf24' },
                        { value: 'eng', label: '英語', color: '#2f9e44' },
                        { value: 'sci', label: '科学', color: '#c92a2a' },
                        { value: 'hum', label: '人文', color: '#8b5cf6' }
                      ].map(category => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => setSelectedCategory(category.value)}
                          style={{
                            padding: '8px 16px',
                            background: selectedCategory === category.value 
                              ? category.color 
                              : '#27272a',
                            color: selectedCategory === category.value ? '#18181b' : '#e4e4e7',
                            border: '1.5px solid',
                            borderColor: selectedCategory === category.value ? category.color : '#27272a',
                            borderRadius: '20px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '0.9rem'
                          }}
                          onMouseOver={e => selectedCategory !== category.value && (e.target.style.background = '#3f3f46')}
                          onMouseOut={e => selectedCategory !== category.value && (e.target.style.background = '#27272a')}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>

              {/* 検索結果 */}
              {resultCourses.length > 0 && (
                <div>
                  <h3 style={{ 
                    color: '#2563eb', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <FaBook /> 検索結果（{resultCourses.length}件）
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gap: '20px',
                      gridTemplateColumns: window.innerWidth <= 600 ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
                      width: '100%',
                      maxWidth: 600,
                      margin: '0 auto',
                      boxSizing: 'border-box',
                    }}
                  >
                    {resultCourses.map(course => {
                      const category = getCategoryName(course.name);
                      const stats = courseStats[course.id] || { enrolledCount: 0, rating: 0, ratingCount: 0 };
                      const isEnrolled = userEnrollments[course.id];
                      
                      return (
                        <div key={course.id} style={{
                          background: '#fff',
                          padding: window.innerWidth <= 600 ? '16px' : '24px',
                          borderRadius: '16px',
                          border: '1.5px solid #cbd5e1',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          cursor: 'pointer',
                          position: 'relative',
                          width: '100%',
                          maxWidth: '100%',
                          margin: '0 auto',
                          boxSizing: 'border-box',
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
                        }}
                        onClick={() => navigate(`/course/${course.id}`)}
                        >
                          {/* 詳細ページリンクアイコン */}
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            color: '#a1a1aa',
                            fontSize: '1.2rem',
                            opacity: 0.7
                          }}>
                            <FaExternalLinkAlt />
                          </div>

                          {/* ヘッダー */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '16px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px'
                            }}>
                              <FaGraduationCap style={{ color: '#2563eb', fontSize: '1.2rem' }} />
                              <strong style={{ color: '#2563eb', fontSize: '1.1rem' }}>{course.name}</strong>
                            </div>
                            <div style={{
                              background: getCategoryColor(category),
                              color: '#18181b',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}>
                              {category.toUpperCase()}
                            </div>
                          </div>

                          {/* 教授名 */}
                          <div style={{ 
                            color: '#e4e4e7', 
                            marginBottom: '12px',
                            fontSize: '1rem'
                          }}>
                            <strong>教授:</strong> {course.professor}
                          </div>

                          {/* 説明 */}
                          <div style={{ 
                            color: '#a1a1aa', 
                            fontSize: '0.95rem', 
                            lineHeight: '1.5',
                            marginBottom: '16px'
                          }}>
                            {course.description}
                          </div>

                          {/* 統計情報 */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: '#a1a1aa',
                              fontSize: '0.9rem'
                            }}>
                              <FaUsers style={{ color: '#22d3ee' }} />
                              <span>{stats.enrolledCount}人が受講中</span>
                            </div>
                            {stats.rating > 0 && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: '#fbbf24',
                                fontSize: '0.9rem'
                              }}>
                                <FaStar />
                                <span>{stats.rating.toFixed(1)} ({stats.ratingCount}件)</span>
                              </div>
                            )}
                          </div>

                          {/* 受講ボタン */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // カードのクリックイベントを阻止
                              handleEnrollment(course.id);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 20px',
                              background: isEnrolled 
                                ? 'linear-gradient(135deg, #2f9e44, #22d3ee)' 
                                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'transform 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px'
                            }}
                            onMouseOver={e => e.target.style.transform = 'scale(1.02)'}
                            onMouseOut={e => e.target.style.transform = 'scale(1)'}
                          >
                            {isEnrolled ? (
                              <>
                                <FaCheck /> 受講中
                              </>
                            ) : (
                              <>
                                <FaPlus /> 受講登録
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {resultCourses.length === 0 && courses.length > 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#a1a1aa'
                }}>
                  <FaSearch style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }} />
                  <p>条件に一致する授業が見つかりませんでした</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                    検索条件を変更してお試しください
                  </p>
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
                color: '#2563eb', 
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
                  <CommentWithBadge key={comment.id} comment={comment} getBadgeForUid={getBadgeForUid} />
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
                  color: '#2563eb', 
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
                      onFocus={(e) => e.target.style.borderColor = '#2563eb'}
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
                      onFocus={(e) => e.target.style.borderColor = '#2563eb'}
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
                      onFocus={(e) => e.target.style.borderColor = '#2563eb'}
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
                  color: '#2563eb', 
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
                      onFocus={(e) => e.target.style.borderColor = '#2563eb'}
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
                      onFocus={(e) => e.target.style.borderColor = '#2563eb'}
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
                      onFocus={(e) => e.target.style.borderColor = '#2563eb'}
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

// コメント＋バッジ表示用コンポーネント
function CommentWithBadge({ comment, getBadgeForUid }) {
  const [badge, setBadge] = useState('Member');
  useEffect(() => {
    (async () => {
      const b = await getBadgeForUid(comment.uid);
      setBadge(b);
    })();
  }, [comment.uid]);
  return (
    <div style={{
      background: '#18181b',
      padding: '20px',
      borderRadius: '16px',
      border: '1.5px solid #27272a',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px'
      }}>
        <FaUser style={{ color: '#fbbf24', fontSize: '1rem' }} />
        <strong style={{ color: '#fbbf24' }}>{comment.name || "匿名"}</strong>
        <span style={{
          background: badge === 'Gold' ? '#fbbf24' : badge === 'Founder' ? '#8b5cf6' : '#22d3ee',
          color: '#18181b',
          borderRadius: '8px',
          padding: '2px 10px',
          fontWeight: 'bold',
          fontSize: '0.85rem',
          marginLeft: '2px',
          letterSpacing: '0.03em',
          border: '1.5px solid #27272a',
          boxShadow: '0 1px 4px rgba(0,0,0,0.10)'
        }}>{badge}</span>
      </div>
      <div style={{ color: '#e4e4e7', lineHeight: '1.6', fontSize: '1rem' }}>{comment.text}</div>
    </div>
  );
}

export default Home;











