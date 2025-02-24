import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './LandingPage';
import CreateResumePage from './CreateResumePage';
import AnalyzeResumePage from './AnalyzeResumePage';
import Header from '../../pages/Header';

function ResumeAssistant() {
  return (
    <div className="min-h-screen">
        <Header isForDashboard={true} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateResumePage />} />
        <Route path="/analyze" element={<AnalyzeResumePage />} />
      </Routes>
    </div>
  );
}

export default ResumeAssistant;