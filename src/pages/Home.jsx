import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  db, auth, loginWithGoogle, loginAnonymously, logout, onAuthChange
} from '../firebase';
import {
  collection, getDocs, addDoc, query, orderBy, Timestamp
} from 'firebase/firestore';

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
    <div style={{ backgroundColor: '#fff4e6', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        {user ? (
          <div>
            <span>ログイン中: {user.isAnonymous ? '匿名ユーザー' : user.displayName || 'ユーザー'}</span>
            <button onClick={logout} style={{ marginLeft: '10px', padding: '6px 12px', borderRadius: '20px', backgroundColor: '#c92a2a', color: 'white', border: 'none' }}>ログアウト</button>
          </div>
        ) : (
          <div>
            <button onClick={loginWithGoogle} style={{ marginRight: '10px', padding: '6px 12px', borderRadius: '20px', backgroundColor: '#2f9e44', color: 'white', border: 'none' }}>Googleでログイン</button>
            <button onClick={loginAnonymously} style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: '#c92a2a', color: 'white', border: 'none' }}>匿名ログイン</button>
          </div>
        )}
      </div>

      <h1 style={{ color: '#c92a2a', marginTop: '60px', fontSize: '2.5rem' }}>Kimuchiへようこそ</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="授業名を検索（例：econ 170）"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ padding: '10px', width: '80%', maxWidth: '300px', marginRight: '10px', borderRadius: '12px', border: '1px solid #ccc' }}
        />
        <button style={{ backgroundColor: '#2f9e44', color: 'white', padding: '10px 16px', border: 'none', borderRadius: '20px' }}>
          検索
        </button>
      </form>

      {resultCourses.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ borderBottom: '2px solid #c92a2a' }}>検索結果（楽単授業）</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {resultCourses.map(course => (
              <li key={course.id} style={{ marginBottom: '10px', backgroundColor: '#fff', padding: '12px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <strong>{course.name}</strong><br />
                {course.professor}<br />
                {course.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 style={{ borderBottom: '2px solid #c92a2a' }}>全体コメント一覧</h2>
      <div style={{ display: 'grid', gap: '10px', justifyContent: 'center' }}>
        {comments.map(comment => (
          <div key={comment.id} style={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '12px',
            padding: '16px',
            width: '90%',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <strong>{comment.name || "匿名"}</strong>（{comment.courseId}）<br />
            {comment.text}
          </div>
        ))}
      </div>

      <h2 style={{ borderBottom: '2px solid #c92a2a', marginTop: '40px' }}>コメント投稿</h2>
      <form onSubmit={handleCommentSubmit} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="あなたの名前（任意）"
          value={commentName}
          onChange={(e) => setCommentName(e.target.value)}
          style={{ padding: '8px', borderRadius: '8px', width: '250px', marginBottom: '10px' }}
        /><br />
        <input
          type="text"
          placeholder="対象の授業ID（例：econ170-davisscott）"
          value={commentCourseId}
          onChange={(e) => setCommentCourseId(e.target.value)}
          style={{ padding: '8px', borderRadius: '8px', width: '250px', marginBottom: '10px' }}
        /><br />
        <textarea
          rows="4"
          cols="40"
          placeholder="コメント内容"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ padding: '8px', borderRadius: '8px' }}
        /><br />
        <button style={{ backgroundColor: '#c92a2a', color: 'white', padding: '10px 16px', border: 'none', borderRadius: '20px' }}>
          投稿する
        </button>
      </form>

      <h2 style={{ borderBottom: '2px solid #2f9e44' }}>楽単授業を提案する</h2>
      <form onSubmit={handleAddCourse}>
        <input
          type="text"
          placeholder="教科名（例：Econ 170）"
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
          style={{ padding: '8px', borderRadius: '8px', width: '250px', marginBottom: '10px' }}
        /><br />
        <input
          type="text"
          placeholder="教授名（例：Davis Scott）"
          value={newProfessor}
          onChange={(e) => setNewProfessor(e.target.value)}
          style={{ padding: '8px', borderRadius: '8px', width: '250px', marginBottom: '10px' }}
        /><br />
        <textarea
          rows="3"
          cols="40"
          placeholder="授業の説明"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ padding: '8px', borderRadius: '8px' }}
        /><br />
        <button style={{ backgroundColor: '#2f9e44', color: 'white', padding: '10px 16px', border: 'none', borderRadius: '20px' }}>
          提案を送信
        </button>
      </form>

      <footer style={{ marginTop: '60px', borderTop: '1px solid #ccc', paddingTop: '20px', textAlign: 'center' }}>
        <Link to="/legal" style={{ color: '#888', marginRight: '20px', textDecoration: 'none' }}>
          法的事項
        </Link>
        <Link to="/tokushoho" style={{ color: '#888', textDecoration: 'none' }}>
          特定商取引法に基づく表記
        </Link>
      </footer>
    </div>
  );
}

export default Home;











