import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db, auth, onAuthChange } from '../firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { 
  FaArrowLeft, FaGraduationCap, FaUser, FaComment, FaPlus, FaCheck, 
  FaUsers, FaStar, FaClock, FaBook, FaSignOutAlt, FaGoogle, FaUserSecret
} from 'react-icons/fa';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const [userEnrollments, setUserEnrollments] = useState({});
  const [courseStats, setCourseStats] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [badgeCache, setBadgeCache] = useState({});

  useEffect(() => {
    fetchCourse();
    fetchComments();
    onAuthChange(setUser);
  }, [id]);

  useEffect(() => {
    if (user) {
      fetchUserEnrollments();
    }
  }, [user]);

  useEffect(() => {
    if (course) {
      fetchCourseStats();
    }
  }, [course]);

  const fetchCourse = async () => {
    const snapshot = await getDocs(query(collection(db, 'courses'), where('id', '==', id)));
    if (!snapshot.empty) {
      setCourse(snapshot.docs[0].data());
    }
  };

  const fetchComments = async () => {
    const q = query(
      collection(db, 'comments'),
      where('courseId', '==', id),
      orderBy('timestamp', 'desc')
    );
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
    if (!course) return;
    const statsDoc = await getDoc(doc(db, 'courseStats', course.id));
    if (statsDoc.exists()) {
      setCourseStats(statsDoc.data());
    } else {
      setCourseStats({ enrolledCount: 0, rating: 0, ratingCount: 0 });
    }
  };

  const handleEnrollment = async () => {
    if (!user) {
      alert('ログインが必要です');
      return;
    }

    const isEnrolled = userEnrollments[course.id];
    const userRef = doc(db, 'userEnrollments', user.uid);
    const courseStatsRef = doc(db, 'courseStats', course.id);

    try {
      if (isEnrolled) {
        // 受講取り消し
        await updateDoc(userRef, {
          [`enrolledCourses.${course.id}`]: false
        });
        await updateDoc(courseStatsRef, {
          enrolledCount: increment(-1)
        });
        setUserEnrollments(prev => ({ ...prev, [course.id]: false }));
        setCourseStats(prev => ({
          ...prev,
          enrolledCount: prev.enrolledCount - 1
        }));
      } else {
        // 受講登録
        await setDoc(userRef, {
          enrolledCourses: { ...userEnrollments, [course.id]: true }
        }, { merge: true });
        await setDoc(courseStatsRef, {
          enrolledCount: increment(1)
        }, { merge: true });
        setUserEnrollments(prev => ({ ...prev, [course.id]: true }));
        setCourseStats(prev => ({
          ...prev,
          enrolledCount: prev.enrolledCount + 1
        }));
      }
    } catch (error) {
      console.error('受講登録エラー:', error);
      alert('エラーが発生しました');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        name: name || (user?.isAnonymous ? '匿名' : user?.displayName || 'ユーザー'),
        text,
        courseId: id,
        timestamp: Timestamp.now(),
        uid: user?.uid || null
      });

      setName('');
      setText('');
      fetchComments();
    } catch (error) {
      console.error('コメント投稿エラー:', error);
      alert('コメントの投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (courseName) => {
    const name = courseName.toLowerCase();
    if (name.includes('econ')) return '#22d3ee';
    if (name.includes('math')) return '#fbbf24';
    if (name.includes('eng')) return '#2f9e44';
    if (name.includes('sci') || name.includes('bio') || name.includes('chem')) return '#c92a2a';
    if (name.includes('hum') || name.includes('hist') || name.includes('phil')) return '#8b5cf6';
    return '#6366f1';
  };

  const getCategoryName = (courseName) => {
    const name = courseName.toLowerCase();
    if (name.includes('econ')) return 'ECON';
    if (name.includes('math')) return 'MATH';
    if (name.includes('eng')) return 'ENG';
    if (name.includes('sci') || name.includes('bio') || name.includes('chem')) return 'SCI';
    if (name.includes('hum') || name.includes('hist') || name.includes('phil')) return 'HUM';
    return 'OTHER';
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

  if (!course) {
    return (
      <div style={{ 
        backgroundColor: '#18181b', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#f4f4f5',
        fontSize: '1.2rem'
      }}>
        読み込み中...
      </div>
    );
  }

  const isEnrolled = userEnrollments[course.id];
  const categoryColor = getCategoryColor(course.name);
  const categoryName = getCategoryName(course.name);

  return (
    <div style={{ 
      backgroundColor: '#f1f5f9', 
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      color: '#1e293b'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* ヘッダー */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          padding: '20px',
          background: '#fff',
          borderRadius: '16px',
          border: '1.5px solid #cbd5e1',
          boxShadow: '0 4px 20px rgba(30,41,59,0.10)'
        }}>
          <Link to="/home" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#2563eb',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            <FaArrowLeft /> ホームに戻る
          </Link>

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
        </div>

        {/* 授業詳細 */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          border: '1.5px solid #cbd5e1',
          boxShadow: '0 8px 32px rgba(30,41,59,0.10)',
          marginBottom: '40px',
          color: '#1e293b',
        }}>
          {/* 授業ヘッダー */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ flex: '1' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <FaGraduationCap style={{ color: '#2563eb', fontSize: '2rem' }} />
                <h1 style={{ 
                  color: '#2563eb', 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  {course.name}
                </h1>
                <div style={{
                  background: '#e0e7ef',
                  color: '#2563eb',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {categoryName}
                </div>
              </div>
              
              <div style={{ 
                color: '#334155', 
                fontSize: '1.3rem',
                marginBottom: '20px'
              }}>
                <strong>教授:</strong> {course.professor}
              </div>

              <div style={{ 
                color: '#a1a1aa', 
                fontSize: '1.1rem', 
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                {course.description}
              </div>

              {/* 統計情報 */}
              <div style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#a1a1aa',
                  fontSize: '1rem'
                }}>
                  <FaUsers style={{ color: '#22d3ee' }} />
                  <span>{courseStats.enrolledCount || 0}人が受講中</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#a1a1aa',
                  fontSize: '1rem'
                }}>
                  <FaComment style={{ color: '#fbbf24' }} />
                  <span>{comments.length}件のコメント</span>
                </div>
                {courseStats.rating > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#fbbf24',
                    fontSize: '1rem'
                  }}>
                    <FaStar />
                    <span>{courseStats.rating.toFixed(1)} ({courseStats.ratingCount}件)</span>
                  </div>
                )}
              </div>
            </div>

            {/* 受講ボタン */}
            <button
              onClick={handleEnrollment}
              style={{
                padding: '16px 32px',
                background: isEnrolled 
                  ? 'linear-gradient(135deg, #2f9e44, #22d3ee)' 
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
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
        </div>

        {/* コメントセクション */}
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
            <FaComment /> コメント一覧
          </h2>

          {/* コメント投稿フォーム */}
          <div style={{
            background: '#18181b',
            padding: '24px',
            borderRadius: '16px',
            border: '1.5px solid #27272a',
            marginBottom: '30px'
          }}>
            <h3 style={{ 
              color: '#fbbf24', 
              fontSize: '1.3rem', 
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              コメントを投稿
            </h3>
            
            <form onSubmit={handleSubmit}>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #27272a',
                    background: '#232326',
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
                  コメント内容 *
                </label>
                <textarea
                  rows="4"
                  placeholder="授業の感想や評価を書いてください"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #27272a',
                    background: '#232326',
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

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px 24px',
                  background: isSubmitting ? '#6366f1' : 'linear-gradient(135deg, #c92a2a, #dc2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s',
                  opacity: isSubmitting ? 0.7 : 1
                }}
                onMouseOver={e => !isSubmitting && (e.target.style.transform = 'scale(1.02)')}
                onMouseOut={e => !isSubmitting && (e.target.style.transform = 'scale(1)')}
              >
                {isSubmitting ? '投稿中...' : 'コメントを投稿'}
              </button>
            </form>
          </div>

          {/* コメント一覧 */}
          <div style={{
            display: 'grid',
            gap: '16px',
            maxHeight: '600px',
            overflowY: 'auto',
            paddingRight: '8px'
          }}>
            {comments.length > 0 ? (
              comments.map(comment => (
                <CommentWithBadge key={comment.id} comment={comment} getBadgeForUid={getBadgeForUid} />
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#a1a1aa'
              }}>
                <FaComment style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }} />
                <p>まだコメントがありません</p>
                <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                  最初のコメントを投稿してみましょう！
                </p>
              </div>
            )}
          </div>
        </div>
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
      background: '#fff',
      padding: '20px',
      borderRadius: '16px',
      border: '1.5px solid #cbd5e1',
      boxShadow: '0 4px 16px rgba(30,41,59,0.08)',
      color: '#1e293b',
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

export default CourseDetail;
