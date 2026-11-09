import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomDock } from './components/layout/MobileBottomDock';
import { FloatingScrollGuide } from './components/common/FloatingScrollGuide';
import { ScrollToTop } from './components/common/ScrollToTop';
import { AdminLayout } from './pages/admin/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Portfolio } from './pages/Portfolio';
import { ProjectDetail } from './pages/ProjectDetail';
import { AboutUs } from './pages/AboutUs';
import { Process } from './pages/Process';
import { Contact } from './pages/Contact';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminInquiries } from './pages/admin/AdminInquiries';
import { AdminPortfolio } from './pages/admin/AdminPortfolio';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminSettings } from './pages/admin/AdminSettings';

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingScrollGuide />
      <MobileBottomDock />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="portfolio/:slug" element={<ProjectDetail />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="process" element={<Process />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

