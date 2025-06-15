import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage.jsx'; // ✅ 追加
import Home from './pages/Home.jsx';
import Semester from './pages/Semester.jsx';
import Comments from './pages/Comments.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Legal from './pages/Legal.jsx';
import Tokushoho from './pages/Tokushoho.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* ✅ 修正：ここをLandingPageに */}
        <Route path="/home" element={<Home />} />
        <Route path="/semester/:id" element={<Semester />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/tokushoho" element={<Tokushoho />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);





