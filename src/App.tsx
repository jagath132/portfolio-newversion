import { BrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { Navbar, StarsCanvas, Footer } from './components';
import { useEffect } from 'react';
import { config } from './constants/config';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan"></div>
  </div>
);

const Hero = lazy(() => import('./components/sections/Hero'));
const About = lazy(() => import('./components/sections/About'));
const Education = lazy(() => import('./components/sections/Education'));
const Tech = lazy(() => import('./components/sections/Tech'));
const Experience = lazy(() => import('./components/sections/Experience'));
const Projects = lazy(() => import('./components/sections/Works'));
const Contact = lazy(() => import('./components/sections/Contact'));

const App = () => {
  useEffect(() => {
    if (document.title !== config.html.title) {
      document.title = config.html.title;
    }
  }, []);

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;
