// src/features/security-training/routes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage';

export const SecurityTrainingRoutes = () => (
  <Routes>
    <Route path="/" element={<CoursesPage />} />
    <Route path="/admin" element={<AdminPage />} />
    <Route path="/:courseId" element={<CourseDetailPage />} /> 
    <Route path="/test/:courseId" element={<TestPage />} />
    <Route path="/results/:courseId" element={<ResultsPage />} />
  </Routes>
);