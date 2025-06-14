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
    <div className="container">
      <div className="auth-buttons">
        {user ? (
          <div>
            <span>ログイン中: {user.isAnonymous ? '匿名ユーザー' : user.displayName || 'ユーザー'}</span>
            <button className="red" onClick={logout}>ログアウト</button>
          </div>
        ) : (
          <div>
            <button className="green" onClick={loginWithGoogle}>Googleでログイン</button>
            <button className="green" onClick={loginAnonymously}>匿名ログイン</button>
          </div>
        )}
      </div>

      <h1>Kimuchiへようこそ</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="授業名を検索（例：econ 170）"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="search-btn">検索</button>
      </form>

      {resultCourses.length > 0 && (
        <div>
          <h2>検索結果（楽単授業）</h2>
          <ul className="course-list">
            {resultCourses.map(course => (
              <li key={course.id}>
                <strong>{course.name}</strong><br />
                {course.professor}<br />
                {course.description /* typo修正: discription → description */}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2>全体コメント一覧</h2>
      <div className="comments-grid">
        {comments.map(comment => (
          <div key={comment.id} className="comment-card">
            <strong>{comment.name || "匿名"}</strong>（{comment.courseId}）<br />
            {comment.text}
          </div>
        ))}
      </div>

      <h2>コメント投稿</h2>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="あなたの名前（任意）"
          value={commentName}
          onChange={(e) => setCommentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="対象の授業ID（例：econ170-davisscott）"
          value={commentCourseId}
          onChange={(e) => setCommentCourseId(e.target.value)}
        />
        <textarea
          rows="4"
          placeholder="コメント内容"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button className="red" type="submit">投稿する</button>
      </form>

      <h2 className="alt">楽単授業を提案する</h2>
      <form onSubmit={handleAddCourse}>
        <input
          type="text"
          placeholder="教科名（例：Econ 170）"
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
        />
        <input
          type="text"
          placeholder="教授名（例：Davis Scott）"
          value={newProfessor}
          onChange={(e) => setNewProfessor(e.target.value)}
        />
        <textarea
          rows="3"
          placeholder="授業の説明"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button className="green" type="submit">提案を送信</button>
      </form>

      <footer>
        <Link to="/legal">法的事項</Link>
        <Link to="/tokushoho">特定商取引法に基づく表記</Link>
      </footer>
    </div>
  );
}

export default Home;







