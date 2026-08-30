import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { InteractiveMeshBackground } from './components/layout/InteractiveMeshBackground';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { SkillsTools } from './components/sections/SkillsTools';
import { Projects } from './components/sections/Projects';
import { Certificates } from './components/sections/Certificates';
import { Contact } from './components/sections/Contact';
import { ProjectModal } from './components/modals/ProjectModal';
import { CertificateModal } from './components/modals/CertificateModal';
import { ResumeModal } from './components/modals/ResumeModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { ToastContainer, ToastMessage } from './components/ui/Toast';
import { Project, Certificate } from './types';

// Public Portfolio View Component
const PublicPortfolio: React.FC<{
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}> = ({ onShowToast }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#090A0F] text-slate-100 selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
      {/* Dynamic Interactive Background Atmosphere & Canvas Neural Mesh */}
      <InteractiveMeshBackground />

      {/* Floating Glass Navigation */}
      <Navbar onResumeClick={() => setIsResumeOpen(true)} />

      {/* Main Public Content Sections */}
      <main className="relative z-10">
        <Hero onResumeClick={() => setIsResumeOpen(true)} />
        <About />
        <SkillsTools />
        <Projects onSelectProject={(proj) => setSelectedProject(proj)} />
        <Certificates onSelectCertificate={(cert) => setSelectedCertificate(cert)} />
        <Contact onShowToast={onShowToast} />
      </main>

      {/* Minimal Footer (© 2026 Ashikur Rahman, no Lovable) */}
      <Footer />

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
};

// Protected Admin Route Wrapper
const ProtectedAdminRoute: React.FC<{
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}> = ({ onShowToast }) => {
  const { isAdminAuthenticated } = usePortfolio();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout onShowToast={onShowToast} />;
};

export function App() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleShowToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = 'toast-' + Date.now() + Math.random();
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      handleDismissToast(id);
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <PortfolioProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Portfolio Route */}
          <Route path="/" element={<PublicPortfolio onShowToast={handleShowToast} />} />

          {/* Admin Routes */}
          <Route
            path="/admin/login"
            element={<AdminLogin onShowToast={handleShowToast} />}
          />
          <Route
            path="/admin"
            element={<ProtectedAdminRoute onShowToast={handleShowToast} />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Global Toast Notification System */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </PortfolioProvider>
  );
}

export default App;
