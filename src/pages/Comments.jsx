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
    <div className="bg-slate-100 min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-6 sm:mb-8">授業にコメントを残す</h2>
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg mb-8">
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
                placeholder="例：Fall 2024"
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
            {comments.map((c, i) => (
              <div key={i} className="border-b border-slate-200 pb-4 sm:pb-6 last:border-b-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-0">
                    <strong className="text-sm sm:text-base text-slate-800">{c.name || "匿名"}</strong>
                    <span className="text-xs sm:text-sm text-slate-500">（{c.semester || "学期不明"}）</span>
                  </div>
                  <div className="text-yellow-500 text-sm sm:text-base">{renderStars(c.rating)}</div>
                </div>
                <p className="text-sm sm:text-base text-slate-700 mb-3 leading-relaxed">{c.text}</p>
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

export default Comments;



