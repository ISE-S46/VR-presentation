import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import LiveClock from './components/LiveClock';
import InteractiveMeshBackground from './components/InteractiveMeshBackground';
import ScrollProgress from './components/ScrollProgress';
import PresentationTour from './components/PresentationTour';
import './styles/App.css';

const Home = lazy(() => import('./pages/Home'));
const Introduction = lazy(() => import('./pages/Introduction'));
const OurPartners = lazy(() => import('./pages/OurPartners'));
const OurProjects = lazy(() => import('./pages/OurProjects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const DemoProject = lazy(() => import('./pages/DemoProject'));
const CollaborationOpportunities = lazy(() => import('./pages/CollaborationOpportunities'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const HomeAssistant = lazy(() => import('./components/HomeAssistant'));

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="route-fallback-spinner" />
      <span>Loading section</span>
    </div>
  );
}

// Page transition: the current page fades + lifts out, a brief beat, then the
// next page settles in — giving a clear separation between sections instead of
// hard-cutting. `mode="wait"` keeps the two from overlapping.
const pageMotion = {
  // Enter is opacity-only — each page already plays its own fade-and-rise via
  // the `animate-fade-in` class, so we don't double up the vertical motion.
  // The lift on exit is what gives the clear "this page is leaving" separation.
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="page-motion"
        initial={pageMotion.initial}
        animate={pageMotion.animate}
        exit={pageMotion.exit}
        transition={pageMotion.transition}
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Introduction" element={<Introduction />} />
            <Route path="/OurPartners" element={<OurPartners />} />
            <Route path="/OurProjects" element={<OurProjects />} />
            <Route path="/OurProjects/ProjectDetail" element={<ProjectDetail />} />
            <Route path="/OurProjects/DemoProject" element={<DemoProject />} />
            <Route path="/OurProjects/CollaborationOpportunities" element={<CollaborationOpportunities />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-root">

        {/* Background elements stay persistent across all pages */}
        <InteractiveMeshBackground />
        <div className="bg-animation">
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
          <div className="bg-orb bg-orb-3"></div>
        </div>

        <LiveClock />

        {/* Reading-progress bar + back-to-top control, resets scroll per route */}
        <ScrollProgress />

        {/* Animated page transitions for clear separation between sections */}
        <AnimatedRoutes />
        
        {/* Global 3D Avatar Assistant */}
        <Suspense fallback={null}>
          <HomeAssistant />
        </Suspense>

        {/* One-click guided presentation that narrates every section */}
        <PresentationTour />

      </div>
    </BrowserRouter>
  );
}

export default App;
