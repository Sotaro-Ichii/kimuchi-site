import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Semester from './pages/Semester.jsx';
import Comments from './pages/Comments.jsx';
import Course from './pages/Course.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />  // ✅ 検索フォームがあるHomeを表示
        <Route path="/semester/:id" element={<Semester />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/course/:id" element={<Course />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);



