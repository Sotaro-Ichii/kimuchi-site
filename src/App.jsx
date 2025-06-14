// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthChange } from './firebase';

// ページコンポーネント
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import SemesterPage from './pages/SemesterPage';
import CommentsPage from './pages/CommentsPage';
import Legal from './pages/Legal';
import Tokushoho from './pages/Tokushoho';

function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) {
    return <div className="text-center mt-10">認証確認中...</div>;
  }

  // 🔒 ユーザーがログインしてなければLPへリダイレクト
  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ LP（未ログイン or 承認前ユーザー用） */}
        <Route path="/" element={<LandingPage />} />

        {/* ✅ ログイン済みユーザーのみ見れるページ（保護） */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/semester/:id"
          element={
            <PrivateRoute>
              <SemesterPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/comments"
          element={
            <PrivateRoute>
              <CommentsPage />
            </PrivateRoute>
          }
        />

        {/* ✅ 法律情報（公開） */}
        <Route path="/legal" element={<Legal />} />
        <Route path="/tokushoho" element={<Tokushoho />} />

        {/* ✅ 404ページ */}
        <Route path="*" element={<div className="text-center mt-10 text-red-600">404 - ページが見つかりません</div>} />
      </Routes>
    </Router>
  );
}

export default App;





