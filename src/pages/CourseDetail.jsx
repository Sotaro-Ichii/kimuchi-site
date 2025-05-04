import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  Timestamp
} from 'firebase/firestore';

function CourseDetail() {
  const { id } = useParams();  // courseId をURLから取得
  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

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
    const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;

    await addDoc(collection(db, 'comments'), {
      name,
      text,
      courseId: id,
      timestamp: Timestamp.now(),
    });

    setName('');
    setText('');
    fetchComments();
  };

  useEffect(() => {
    fetchCourse();
    fetchComments();
  }, [id]);

  if (!course) return <div>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#fff4e6', padding: '20px' }}>
      <h2 style={{ color: '#c92a2a' }}>{course.name} / {course.professor}</h2>
      <p>{course.description}</p>

      <h3 style={{ color: '#2f9e44' }}>この授業のコメント</h3>
      <ul>
        {comments.map(comment => (
          <li key={comment.id} style={{ marginBottom: '10px' }}>
            <strong>{comment.name || "匿名"}</strong><br />
            {comment.text}
            <hr />
          </li>
        ))}
      </ul>

      <h4>コメントを投稿する</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前（任意）"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />
        <textarea
          rows="3"
          cols="40"
          placeholder="コメント内容"
          value={text}
          onChange={(e) => setText(e.target.value)}
        /><br />
        <button type="submit" style={{ backgroundColor: '#c92a2a', color: 'white', padding: '8px 12px', border: 'none' }}>
          投稿
        </button>
      </form>
    </div>
  );
}

export default CourseDetail;
