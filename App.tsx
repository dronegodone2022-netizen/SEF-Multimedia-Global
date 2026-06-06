
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import FAQ from './components/FAQ';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import CategoryPage from './components/CategoryPage';
import ProjectDetailPage from './components/ProjectDetailPage';
import CoursesPage from './components/CoursesPage';
import LearningCTA from './components/LearningCTA';
import Gallery from './components/Gallery';
import AboutPage from './components/AboutPage';
import PolicyPage from './components/PolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import { isAdminAuthenticated } from './src/lib/adminAuth';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAdminAuthenticated() ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

const Home = () => (
  <>
    <Header />
    <main>
      <Hero />
      <Services />
      <LearningCTA />
      <Portfolio />
      <Testimonials />
      <FAQ />
    </main>
    <Footer />
  </>
);

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    const observeNode = (node: Element) => {
      if (node.classList.contains('visible')) return;
      observer.observe(node);
    };

    const observeAll = (root: ParentNode = document.body) => {
      root.querySelectorAll('.unveil, .unveil-left, .unveil-right, .unveil-scale').forEach(observeNode);
    };

    observeAll();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches('.unveil, .unveil-left, .unveil-right, .unveil-scale')) {
            observeNode(node);
          }
          node.querySelectorAll('.unveil, .unveil-left, .unveil-right, .unveil-scale').forEach(observeNode);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <div className="bg-white selection:bg-indigo-600 selection:text-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:categoryName" element={<CategoryPage />} />
            <Route path="/project/:projectId" element={<ProjectDetailPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/policy" element={<PolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } />
          </Routes>

          {/* Scroll to Top FAB */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 bg-amber-600 text-white p-4 rounded-full shadow-2xl z-50 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300"
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </Router>
    </GoogleOAuthProvider>
  ) : (
    <Router>
      <div className="bg-white selection:bg-indigo-600 selection:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:categoryName" element={<CategoryPage />} />
          <Route path="/project/:projectId" element={<ProjectDetailPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
        </Routes>

        {/* Scroll to Top FAB */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-amber-600 text-white p-4 rounded-full shadow-2xl z-50 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </Router>
  );
}

export default App;
