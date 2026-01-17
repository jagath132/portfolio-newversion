import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from '@vercel/analytics/react';

import { Navbar, StarsCanvas, Footer } from './components';
import { config } from './constants/config';
import { AuthProvider } from './context/AuthContext';
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'));
const Login = lazy(() => import('./admin/pages/Login'));
const Signup = lazy(() => import('./admin/pages/Signup'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const ProjectManager = lazy(() => import('./admin/pages/ProjectManager'));
const ExperienceManager = lazy(() => import('./admin/pages/ExperienceManager'));
const SkillsManager = lazy(() => import('./admin/pages/SkillsManager'));
const EducationManager = lazy(() => import('./admin/pages/EducationManager'));
const SectionContentManager = lazy(() => import('./admin/pages/SectionContentManager'));

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
      if (
        navEntries.length > 0 &&
        (navEntries[0] as PerformanceNavigationTiming).type === 'reload'
      ) {
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

// Lazy imports for Admin pages are handled above

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
              <Route path="/login" element={<Suspense fallback={<LoadingFallback />}><Login /></Suspense>} />
              <Route path="/signup" element={<Suspense fallback={<LoadingFallback />}><Signup /></Suspense>} />
              <Route
                path="/"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminLayout />
                  </Suspense>
                }
              >
                <Route index element={<Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>} />
                <Route path="projects" element={<Suspense fallback={<LoadingFallback />}><ProjectManager /></Suspense>} />
                <Route path="experience" element={<Suspense fallback={<LoadingFallback />}><ExperienceManager /></Suspense>} />
                <Route path="skills" element={<Suspense fallback={<LoadingFallback />}><SkillsManager /></Suspense>} />
                <Route path="education" element={<Suspense fallback={<LoadingFallback />}><EducationManager /></Suspense>} />
                <Route path="sections" element={<Suspense fallback={<LoadingFallback />}><SectionContentManager /></Suspense>} />
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
        <Analytics />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
