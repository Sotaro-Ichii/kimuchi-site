import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import SemesterPage from './pages/SemesterPage';
import CommentsPage from './pages/CommentsPage';
import Legal from './pages/Legal';
import Tokushoho from './pages/Tokushoho';

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ 最初に表示されるLP */}
        <Route path="/" element={<LandingPage />} />

        {/* ✅ 本会員のみアクセスするホーム画面 */}
        <Route path="/home" element={<Home />} />

        {/* ✅ 学期別ページ */}
        <Route path="/semester/:id" element={<SemesterPage />} />

        {/* ✅ コメントページ */}
        <Route path="/comments" element={<CommentsPage />} />

        {/* ✅ 法律ページ */}
        <Route path="/legal" element={<Legal />} />
        <Route path="/tokushoho" element={<Tokushoho />} />
      </Routes>
    </Router>
  );
}

export default App;




