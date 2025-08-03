import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaGithub, FaArrowLeft } from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 実際のメール送信処理は後で実装
    // 現在は模擬的な処理
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  return (
    <div className="bg-slate-100 min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8 sm:mb-12">
          <Link to="/home" className="inline-flex items-center gap-2 text-blue-600 no-underline text-sm sm:text-base font-semibold mb-6 sm:mb-8 hover:text-blue-700 transition-colors">
            <FaArrowLeft /> ホームに戻る
          </Link>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 text-center mb-2 sm:mb-4">
            お問い合わせ
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-center text-slate-600 mb-8 sm:mb-12">
            ご質問・ご要望・バグ報告など、お気軽にお問い合わせください
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* 左側：お問い合わせフォーム */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-lg">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-6 sm:mb-8 flex items-center gap-3">
              <FaEnvelope /> メッセージを送信
            </h2>

            {submitStatus === 'success' && (
              <div className="bg-green-600 text-white p-4 rounded-xl mb-6 text-center font-semibold">
                お問い合わせを送信しました。ありがとうございます！
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-slate-800 text-sm sm:text-base">
                  お名前 *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-slate-800 text-sm sm:text-base">
                  メールアドレス *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-slate-800 text-sm sm:text-base">
                  件名 *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-slate-800 text-sm sm:text-base">
                  メッセージ *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors resize-vertical"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-500 hover:to-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed text-white border-none rounded-xl text-sm sm:text-base font-bold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? '送信中...' : 'メッセージを送信'}
              </button>
            </form>
          </div>

          {/* 右側：連絡先情報 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-lg h-fit">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-6 sm:mb-8">
              連絡先情報
            </h2>

            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-600 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                  <FaEnvelope /> メール
                </h3>
                <p className="text-sm sm:text-base text-slate-800 mb-2">
                  sotta.san17@gmail.com
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  通常24時間以内に返信いたします
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-600 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                  <FaPhone /> 電話番号
                </h3>
                <p className="text-sm sm:text-base text-slate-800 mb-2">
                  657-709-1289
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  緊急時のみ。平日9:00-18:00
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-200">
                <h3 className="text-sm sm:text-base font-semibold text-blue-600 mb-3 sm:mb-4">
                  よくある質問
                </h3>
                <ul className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-1 pl-4">
                  <li>• アカウントの承認について</li>
                  <li>• 支払い方法の変更</li>
                  <li>• バグ報告・改善提案</li>
                  <li>• 新しい機能のリクエスト</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact; 