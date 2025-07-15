import React from "react";
import { FaUser, FaComment, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const sampleCourses = [
  { id: 'ECON101', name: 'ECON 101（楽単・出席重視）', professor: 'Tanaka', description: '出席点が高く、テストも簡単。' },
  { id: 'MATH010', name: 'MATH 010（ほぼ中学レベル）', professor: 'Smith', description: '内容が易しく、課題も少ない。' },
  { id: 'ENG200', name: 'ENG 200（エッセイ中心）', professor: 'Lee', description: 'エッセイ提出のみで単位が取れる。' },
];
const sampleComments = [
  { id: 1, name: '先輩A', text: 'この授業は本当に楽でした！' },
  { id: 2, name: '先輩B', text: '出席だけで単位がもらえます。' },
  { id: 3, name: '先輩C', text: 'テストも簡単でおすすめ。' },
];

export default function DemoHome() {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', color: '#1e293b', padding: '32px 0' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 24, boxShadow: '0 4px 24px rgba(30,41,59,0.10)', padding: 32, border: '1.5px solid #e0e7ef' }}>
        <h1 style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '2.2rem', marginBottom: 16, textAlign: 'center' }}>Kimuchi デモ体験</h1>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ background: '#22d3ee', color: '#fff', borderRadius: 9999, padding: '6px 18px', fontWeight: 'bold', fontSize: '1.1rem' }}>ゲストモード（サンプルのみ表示）</span>
        </div>
        <h2 style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: 12 }}>サンプル授業</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 28 }}>
          {sampleCourses.map(course => (
            <div key={course.id} style={{ background: '#f1f5f9', borderRadius: 12, border: '1.5px solid #cbd5e1', padding: 16, color: '#1e293b' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 4 }}>{course.name}</div>
              <div style={{ color: '#a1a1aa', fontSize: '0.95rem', marginBottom: 4 }}>教授: {course.professor}</div>
              <div style={{ fontSize: '0.95rem' }}>{course.description}</div>
            </div>
          ))}
        </div>
        <h2 style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 12 }}>サンプルコメント</h2>
        <ul style={{ marginBottom: 32 }}>
          {sampleComments.map(c => (
            <li key={c.id} style={{ background: '#fff', border: '1.5px solid #e0e7ef', borderRadius: 12, padding: 12, marginBottom: 10, color: '#334155' }}>
              <FaUser style={{ color: '#2563eb', marginRight: 6 }} />
              <strong>{c.name}</strong>：{c.text}
            </li>
          ))}
        </ul>
        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '1.2rem', display: 'block', marginBottom: 12 }}>会員登録で全機能が解放されます！</span>
          <button
            onClick={() => navigate("/")}
            style={{ padding: '12px 32px', background: 'linear-gradient(90deg,#2563eb,#1e40af)', color: '#fff', border: 'none', borderRadius: '9999px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(30,41,59,0.10)', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <FaArrowRight /> 会員登録ページへ戻る
          </button>
        </div>
      </div>
    </div>
  );
} 