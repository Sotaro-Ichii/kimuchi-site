// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import SemesterPage from './pages/SemesterPage';
import CommentsPage from './pages/CommentsPage';
import Legal from './pages/Legal';
import Tokushoho from './pages/Tokushoho';
import './index.css'; // TailwindCSS やグローバルCSSを適用

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        認証確認中...
      </div>
    );
  }
  return user ? children : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/semester/:id" element={<PrivateRoute><SemesterPage /></PrivateRoute>} />
      <Route path="/comments" element={<PrivateRoute><CommentsPage /></PrivateRoute>} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/tokushoho" element={<Tokushoho />} />
      <Route path="*" element={<div className="text-center py-10 text-gray-500">404 Not Found</div>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* サイト共通ヘッダー */}
        <header className="flex items-center justify-start px-6 py-4 bg-[#fff4e6] border-b">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Kimuchi logo" className="w-8 h-8 rounded-full" />
            <h1 className="text-xl font-bold text-[#c92a2a]">Kimuchi</h1>
          </Link>
        </header>
        <main>
          <AppRoutes />
        </main>
      </Router>
    </AuthProvider>
  );
}







