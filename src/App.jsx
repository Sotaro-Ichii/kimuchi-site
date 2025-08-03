// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Semester from './pages/Semester';
import Comments from './pages/Comments';
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

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/demo" element={<DemoHome />} />
      
      {/* 認証が必要なルート */}
      {initialized && !loading && (
        <>
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/semester/:id" element={<PrivateRoute><Semester /></PrivateRoute>} />
          <Route path="/comments" element={<PrivateRoute><Comments /></PrivateRoute>} />
          <Route path="/course/:id" element={<PrivateRoute><CourseDetail /></PrivateRoute>} />
        </>
      )}
      
      <Route path="*" element={<div className="text-center py-10 text-gray-500">404 Not Found</div>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <main>
          <AppRoutes />
        </main>
      </Router>
    </AuthProvider>
  );
}







