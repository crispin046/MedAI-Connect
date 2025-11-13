import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { TriagePage } from './components/TriagePage';
import { KnowledgePage } from './components/KnowledgePage';
import { AboutPage } from './components/AboutPage';
import { ReferralsPage } from './components/ReferralsPage';
import { VideoCallPage } from './components/VideoCallPage';
import { FindDoctorPage } from './components/FindDoctorPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { SavedRecordsPage } from './components/SavedRecordsPage';


export default function App() {
  const [language, setLanguage] = useState<string>('English');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header language={language} onLanguageChange={setLanguage} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/triage" element={<TriagePage language={language} />} />
        <Route path="/knowledge" element={<KnowledgePage language={language} />} />
        <Route path="/referrals" element={<ReferralsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/find-doctor" element={<FindDoctorPage />} />
        <Route path="/saved-records" element={<SavedRecordsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/call/:referralId" element={<VideoCallPage />} />
      </Routes>
    </div>
  );
}