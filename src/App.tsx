import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ReportLostPage } from './pages/ReportLostPage';
import { ReportFoundPage } from './pages/ReportFoundPage';
import { AllItemsPage } from './pages/AllItemsPage';
import { ItemDetailsPage } from './pages/ItemDetailsPage';
import { EditItemPage } from './pages/EditItemPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-stone-50/60 text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report-lost" element={<ReportLostPage />} />
            <Route path="/report-found" element={<ReportFoundPage />} />
            <Route path="/items" element={<AllItemsPage />} />
            <Route path="/items/:id" element={<ItemDetailsPage />} />
            <Route path="/items/:id/edit" element={<EditItemPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Academic Project Footer */}
        <Footer />
      </div>
    </Router>
  );
}
