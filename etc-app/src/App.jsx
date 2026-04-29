import { useState, useEffect } from 'react';
import './App.css';
import LiveClock from './components/LiveClock';
import Home from './pages/Home';
import Introduction from './pages/Introduction';
import OurPartners from './pages/OurPartners';
import OurProjects from './pages/OurProjects';
import ProjectDetail from './pages/ProjectDetail';
import DemoProject from './pages/DemoProject';
import CollaborationOpportunities from './pages/CollaborationOpportunities';
import QnA from './pages/QnA';
import LandingPage from './pages/LandingPage';

function App() {
  const [currentPage, setCurrentPage] = useState('LandingPage');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedPage, setDisplayedPage] = useState('LandingPage');

  const navigate = (pageId) => {
    if (pageId === currentPage) return;
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentPage(pageId);
      setDisplayedPage(pageId);
      window.scrollTo(0, 0);

      // Small delay then fade back in
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    }, 250);
  };

  const renderPage = () => {
    switch (displayedPage) {
      case 'LandingPage':
        return <LandingPage navigate={navigate} />;
      case 'Home':
        return <Home navigate={navigate} />;
      case 'Introduction':
        return <Introduction navigate={navigate} />;
      case 'OurPartners':
        return <OurPartners navigate={navigate} />;
      case 'OurProjects':
        return <OurProjects navigate={navigate} />;
      case 'ProjectDetail':
        return <ProjectDetail navigate={navigate} />;
      case 'DemoProject':
        return <DemoProject navigate={navigate} />;
      case 'CollaborationOpportunities':
        return <CollaborationOpportunities navigate={navigate} />;
      case 'QnA':
        return <QnA navigate={navigate} />;
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <div className="app-root">
      <div className="bg-animation">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>
      <LiveClock />
      <div className="app-logo-container" onClick={() => navigate('LandingPage')}>
        <img src="/logo_etc.png" alt="ETC Logo" className="app-logo-img" />
      </div>
      <div className={`page-transition ${isTransitioning ? 'page-exit' : 'page-enter'}`}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
