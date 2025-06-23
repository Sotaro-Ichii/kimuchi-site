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
import { stripePromise } from '../lib/stripe'; // ✅ Stripe 読み込み

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isPaid, setIsPaid] = useState(false); // ✅ 課金完了フラグ

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

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: id })
    });
    const session = await res.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  useEffect(() => {
    fetchCourse();
    fetchComments();
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "true") {
      setIsPaid(true);
    }
  }, [id]);

  if (!course) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#18181b', padding: '20px', fontFamily: 'sans-serif', color: '#f4f4f5' }}>
      <h2 style={{ color: '#fbbf24' }}>{course.name}</h2>

      {isPaid ? (
        <>
          <p><strong>教授:</strong> {course.professor}</p>
          <p>{course.description}</p>
        </>
      ) : (
        <>
          <p>この授業の詳細を表示するには課金が必要です。</p>
          <button
            onClick={handleCheckout}
            style={{ padding: '10px', backgroundColor: '#2f9e44', color: '#18181b', border: 'none', fontWeight: 700, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
          >
            表示する（¥300）
          </button>
        </>
      )}

      <h3 style={{ color: '#22d3ee', marginTop: '30px' }}>この授業のコメント</h3>
      <ul>
        {comments.map(comment => (
          <li key={comment.id} style={{ marginBottom: '10px', backgroundColor: '#232326', color: '#f4f4f5', border: '1.5px solid #27272a', borderRadius: '12px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
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
          style={{ background: '#232326', color: '#f4f4f5', border: '1.5px solid #27272a', borderRadius: '8px', padding: '8px' }}
        /><br /><br />
        <textarea
          rows="3"
          cols="40"
          placeholder="コメント内容"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ background: '#232326', color: '#f4f4f5', border: '1.5px solid #27272a', borderRadius: '8px', padding: '8px' }}
        /><br />
        <button type="submit" style={{ backgroundColor: '#c92a2a', color: 'white', padding: '8px 12px', border: 'none', fontWeight: 700, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
          投稿
        </button>
      </form>
    </div>
  );
}

export default CourseDetail;
