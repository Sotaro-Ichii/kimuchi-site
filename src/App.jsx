// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import SemesterPage from './pages/SemesterPage';
import CommentsPage from './pages/CommentsPage';
import Legal from './pages/Legal';
import Contact from './pages/Contact';
import CourseDetail from './pages/CourseDetail';
import DemoHome from './pages/DemoHome';
import './index.css'; // TailwindCSS やグローバルCSSを適用

function PrivateRoute({ children }) {
  const { user, loading, initialized } = useAuth();
  
  // 初期化が完了していない場合はローディング表示
  if (!initialized || loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fbbf24] mx-auto mb-4"></div>
          認証確認中...
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { loading, initialized } = useAuth();

  // 初期化が完了していない場合はローディング表示
  if (!initialized || loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fbbf24] mx-auto mb-4"></div>
          読み込み中...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/semester/:id" element={<PrivateRoute><SemesterPage /></PrivateRoute>} />
      <Route path="/comments" element={<PrivateRoute><CommentsPage /></PrivateRoute>} />
      <Route path="/course/:id" element={<PrivateRoute><CourseDetail /></PrivateRoute>} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/demo" element={<DemoHome />} />
      <Route path="*" element={<div className="text-center py-10 text-gray-500">404 Not Found</div>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* サイト共通ヘッダー */}
        <header className="flex items-center justify-between px-8 py-4 bg-[#232326] border-b border-[#27272a] shadow-md">
          <Link to="/" className="flex items-center gap-4">
            <img src="/logo.png" alt="Musashi logo" className="w-10 h-10 rounded-full shadow-lg border-2 border-[#fbbf24] bg-[#18181b]" />
            <span className="text-2xl font-extrabold tracking-wide text-[#fbbf24] drop-shadow">Musashi</span>
          </Link>
        </header>
        <main>
          <AppRoutes />
        </main>
      </Router>
    </AuthProvider>
  );
}







