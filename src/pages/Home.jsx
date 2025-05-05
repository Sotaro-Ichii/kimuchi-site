import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  db, auth, loginWithGoogle, loginAnonymously, logout, onAuthChange
} from '../firebase';
import {
  collection, getDocs, addDoc, query, orderBy, Timestamp
} from 'firebase/firestore';

function normalize(text) {
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
    setCommentText(''); setCommentName(''); setCommentCourseId('');
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
    setNewCourseName(''); setNewProfessor(''); setNewDescription('');
    fetchCourses();
  };

  return (
    <div style={{ backgroundColor: '#fff4e6', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* 🔐 ログインバー右上 */}
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        {user ? (
          <div>
            <span>ログイン中: {user.isAnonymous ? '匿名ユーザー' : user.displayName || 'ユーザー'}</span>
            <button onClick={logout} style={{ marginLeft: '10px', padding: '6px 10px' }}>ログアウト</button>
          </div>
        ) : (
          <div>
            <button onClick={loginWithGoogle} style={{ marginRight: '10px', padding: '6px 10px' }}>Googleでログイン</button>
            <button onClick={loginAnonymously} style={{ padding: '6px 10px' }}>匿名ログイン</button>
          </div>
        )}
      </div>

      <h1 style={{ color: '#c92a2a', marginTop: '60px' }}>Kimuchiへようこそ</h1>

      {/* 🔍 検索 */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="授業名を検索（例：econ 170）"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ padding: '8px', width: '80%', maxWidth: '300px', marginRight: '10px' }}
        />
        <button style={{ backgroundColor: '#2f9e44', color: 'white', padding: '8px 12px', border: 'none' }}>
          検索
        </button>
      </form>

      {resultCourses.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ borderBottom: '2px solid #c92a2a' }}>検索結果（楽単授業）</h2>
          <ul>
            {resultCourses.map(course => (
              <li key={course.id} style={{ marginBottom: '10px' }}>
                <Link to={`/course/${course.id}`} style={{ color: '#c92a2a', fontWeight: 'bold', textDecoration: 'none' }}>
                  {course.name} / {course.professor}
                </Link><br />
                {course.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 💬 コメント一覧 */}
      <h2 style={{ borderBottom: '2px solid #c92a2a' }}>全体コメント一覧</h2>
      <div style={{ display: 'grid', gap: '10px' }}>
        {comments.map(comment => (
          <div key={comment.id} style={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '12px'
          }}>
            <strong>{comment.name || "匿名"}</strong>（{comment.courseId}）<br />
            {comment.text}
          </div>
        ))}
      </div>

      {/* 💬 コメント投稿 */}
      <h2 style={{ borderBottom: '2px solid #c92a2a', marginTop: '40px' }}>コメント投稿</h2>
      <form onSubmit={handleCommentSubmit} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="あなたの名前（任意）"
          value={commentName}
          onChange={(e) => setCommentName(e.target.value)}
        /><br /><br />
        <input
          type="text"
          placeholder="対象の授業ID（例：econ170-davisscott）"
          value={commentCourseId}
          onChange={(e) => setCommentCourseId(e.target.value)}
        /><br /><br />
        <textarea
          rows="4"
          cols="40"
          placeholder="コメント内容"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        /><br />
        <button style={{ backgroundColor: '#c92a2a', color: 'white', padding: '8px 12px', border: 'none' }}>
          投稿する
        </button>
      </form>

      {/* ✍️ 楽単提案 */}
      <h2 style={{ borderBottom: '2px solid #2f9e44' }}>楽単授業を提案する</h2>
      <form onSubmit={handleAddCourse}>
        <input
          type="text"
          placeholder="教科名（例：Econ 170）"
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
        /><br /><br />
        <input
          type="text"
          placeholder="教授名（例：Davis Scott）"
          value={newProfessor}
          onChange={(e) => setNewProfessor(e.target.value)}
        /><br /><br />
        <textarea
          rows="3"
          cols="40"
          placeholder="授業の説明"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        /><br />
        <button style={{ backgroundColor: '#2f9e44', color: 'white', padding: '8px 12px', border: 'none' }}>
          提案を送信
        </button>
      </form>

      {/* 🔗 法的事項ページへのリンク */}
      <footer style={{ marginTop: '60px', borderTop: '1px solid #ccc', paddingTop: '20px', textAlign: 'center' }}>
        <Link to="/legal" style={{ color: '#888', textDecoration: 'none' }}>
          法的事項
        </Link>
      </footer>
    </div>
  );
}

export default Home;




