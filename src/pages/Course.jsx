import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc
} from 'firebase/firestore';

function renderStars(rating) {
  const fullStars = Math.max(0, Math.min(5, rating));
  return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
}

function Course() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('');
  const [rating, setRating] = useState(3);

  const fetchComments = async () => {
    const q = query(
      collection(db, 'comments'),
      where('courseId', '==', id),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map(docSnap => ({
      id: docSnap.id,           // ← ドキュメントIDを含める
      ...docSnap.data()
    }));
    setComments(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() === '') return;

    await addDoc(collection(db, 'comments'), {
      name,
      semester,
      rating,
      text,
      courseId: id,
      timestamp: new Date()
    });

    setText('');
    setName('');
    setSemester('');
    setRating(3);
    fetchComments();
  };

  const handleDelete = async (commentId) => {
    const ok = window.confirm('本当に削除しますか？');
    if (!ok) return;
    await deleteDoc(doc(db, 'comments', commentId));
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>{id} のコメントページ</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前（任意）"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />

        <input
          type="text"
          placeholder="例：Fall 2024"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        /><br /><br />

        <label>評価（1〜5）: </label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value) || 3)}
        /><br /><br />

        <textarea
          rows="4"
          cols="40"
          placeholder="この授業はプレゼンが多くて楽だった…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        /><br />
        <button type="submit">投稿する</button>
      </form>

      <div>
        <h3>投稿されたコメント:</h3>
        <ul>
          {comments.map((c) => (
            <li key={c.id}>
              <strong>{c.name || "匿名"}</strong>（{c.semester || "学期不明"}）：
              {renderStars(c.rating)}<br />
              {c.text}<br />
              <button onClick={() => handleDelete(c.id)}>削除</button>
              <hr />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Course;

