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
    <div className="bg-slate-100 min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-6 sm:mb-8">{id} のコメントページ</h2>

        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">コメントを投稿</h3>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <input
                type="text"
                placeholder="名前（任意）"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="例：Spring 2025"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm sm:text-base font-medium text-slate-700">評価（1〜5）: </label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value) || 3)}
                className="w-20 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <textarea
                rows="4"
                placeholder="この授業はプレゼンが多くて楽だった…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors resize-vertical"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              投稿する
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">投稿されたコメント:</h3>
          <div className="space-y-4 sm:space-y-6">
            {comments.map((c) => (
              <div key={c.id} className="border-b border-slate-200 pb-4 sm:pb-6 last:border-b-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-0">
                    <strong className="text-sm sm:text-base text-slate-800">{c.name || "匿名"}</strong>
                    <span className="text-xs sm:text-sm text-slate-500">（{c.semester || "学期不明"}）</span>
                  </div>
                  <div className="text-yellow-500 text-sm sm:text-base">{renderStars(c.rating)}</div>
                </div>
                <p className="text-sm sm:text-base text-slate-700 mb-3 leading-relaxed">{c.text}</p>
                <button 
                  onClick={() => handleDelete(c.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm rounded transition-colors duration-200"
                >
                  削除
                </button>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm sm:text-base text-slate-500 text-center py-8">まだコメントがありません。最初のコメントを投稿してみましょう！</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Course;

