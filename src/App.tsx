import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Navbar, StarsCanvas, Footer } from './components';
import { config } from './constants/config';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './admin/layouts/AdminLayout';
import Login from './admin/pages/Login';
import Signup from './admin/pages/Signup';
import Dashboard from './admin/pages/Dashboard';
import ProjectManager from './admin/pages/ProjectManager';

// Lazy Load Main Sections
const Hero = lazy(() => import('./components/sections/Hero'));
const About = lazy(() => import('./components/sections/About'));
const Education = lazy(() => import('./components/sections/Education'));
const Tech = lazy(() => import('./components/sections/Tech'));
const Experience = lazy(() => import('./components/sections/Experience'));
const Projects = lazy(() => import('./components/sections/Works'));
const Contact = lazy(() => import('./components/sections/Contact'));

// Loading Fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan"></div>
  </div>
);

const PortfolioLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkReload = () => {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === 'reload') {
        navigate('/');
      }
    };
    checkReload();
  }, [navigate]);

  return (
    <div className="bg-primary relative z-0">
      <div className="bg-hero-pattern bg-cover bg-center bg-no-repeat">
        <Navbar />
        <Suspense fallback={<LoadingFallback />}>
          <Hero />
        </Suspense>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <About />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Education />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Tech />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Projects />
      </Suspense>
      <div className="relative z-0">
        <Suspense fallback={<LoadingFallback />}>
          <Contact />
        </Suspense>
        <StarsCanvas />
      </div>
      <Footer />
    </div>
  );
};

import ExperienceManager from './admin/pages/ExperienceManager';
import SkillsManager from './admin/pages/SkillsManager';
import EducationManager from './admin/pages/EducationManager';

const App = () => {
  useEffect(() => {
    if (document.title !== config.html.title) {
      document.title = config.html.title;
    }
  }, []);

  // Check build mode. If undefined (default vite), assume 'portfolio' or check logic.
  // Actually default vite dev is 'development'. We want strict separation.
  // But let's fallback to portfolio if not specified, OR if not admin.
  // const isAdminMode = import.meta.env.MODE === 'admin' || import.meta.env.VITE_APP_MODE === 'admin';
  const isAdminMode = import.meta.env.VITE_APP_MODE === 'admin';

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {isAdminMode ? (
            <>
              {/* Admin Routes (Hosted on Root) */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<ProjectManager />} />
                <Route path="experience" element={<ExperienceManager />} />
                <Route path="skills" element={<SkillsManager />} />
                <Route path="education" element={<EducationManager />} />
              </Route>
              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              {/* Portfolio Routes */}
              <Route path="/*" element={<PortfolioLayout />} />
            </>
          )}
        </Routes>
        <ToastContainer position="bottom-right" theme="dark" />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
