import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';

// ⭐ 数字から★マークに変換する関数
function renderStars(rating) {
  const fullStars = Math.max(0, Math.min(5, rating));
  return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
}

function Comments() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('');
  const [rating, setRating] = useState(3);

  const fetchComments = async () => {
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map(doc => doc.data());
    setComments(result);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() === '') return;

    await addDoc(collection(db, 'comments'), {
      name,
      semester,
      rating,
      text,
      timestamp: new Date()
    });

    setText('');
    setName('');
    setSemester('');
    setRating(3);
    fetchComments(); // 再読み込み
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>授業にコメントを残す</h2>
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
        />
        <br />
        <button type="submit">投稿する</button>
      </form>

      <div>
        <h3>投稿されたコメント:</h3>
        <ul>
          {comments.map((c, i) => (
            <li key={i}>
              <strong>{c.name || "匿名"}</strong>（{c.semester || "学期不明"}）：
              {renderStars(c.rating)}<br />
              {c.text}
              <hr />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Comments;



