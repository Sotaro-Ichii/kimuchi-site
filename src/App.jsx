import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import SemesterPage from './pages/SemesterPage';
import CommentsPage from './pages/CommentsPage';
import Legal from './pages/Legal';
import Tokushoho from './pages/Tokushoho';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>認証確認中...</div>;
  return user ? children : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
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
      <Route path="/legal" element={<Legal />} />
      <Route path="/tokushoho" element={<Tokushoho />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}






