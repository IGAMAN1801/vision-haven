
import React from 'react';
// Fix: Use namespace import for react-router-dom to bypass type errors
import * as ReactRouterDom from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DesignToolPage from './pages/DesignToolPage';
import GalleryPage from './pages/GalleryPage';
import DashboardPage from './pages/DashboardPage';
import DocumentationPage from './pages/DocumentationPage';
import LoginPage from './pages/LoginPage';
import VendorDashboardPage from './pages/VendorDashboardPage';
import PaymentPage from './pages/PaymentPage';
import ContactPage from './pages/ContactPage';
import ReportPage from './pages/ReportPage';
import VersionHistoryPage from './pages/VersionHistoryPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import Chatbot from './components/Chatbot';

const { HashRouter, Routes, Route } = ReactRouterDom as any;
const Router = HashRouter;

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/design" element={<DesignToolPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/vendor" element={<VendorDashboardPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/version-history" element={<VersionHistoryPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
          </Routes>
        </main>
        <Footer />
        
        {/* AI Concierge Chatbot */}
        <Chatbot />
      </div>
    </Router>
  );
};

export default App;
