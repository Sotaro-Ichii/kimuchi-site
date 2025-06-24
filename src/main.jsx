// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import { AuthProvider } from './contexts/AuthContext'; // ✅ 追加

import LandingPage from './pages/LandingPage.jsx';
import Home from './pages/Home.jsx';
import Semester from './pages/Semester.jsx';
import Comments from './pages/Comments.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Legal from './pages/Legal.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ ここで全体をラップ */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/semester/:id" element={<Semester />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);





