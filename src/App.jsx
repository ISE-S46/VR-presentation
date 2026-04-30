import { useState } from 'react';
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
import './styles/App.css';

const PAGE_COMPONENTS = {
  LandingPage,
  Home,
  Introduction,
  OurPartners,
  OurProjects,
  ProjectDetail,
  DemoProject,
  CollaborationOpportunities,
  QnA,
};

function App() {
  const [currentPage, setCurrentPage] = useState('LandingPage');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = (pageId) => {
    if (pageId === currentPage) return;
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentPage(pageId);
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    }, 250);
  };

  const PageComponent = PAGE_COMPONENTS[currentPage] || LandingPage;

  return (
    <div className="app-root">
      <div className="bg-animation">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>
      <LiveClock />
      <div className={`page-transition ${isTransitioning ? 'page-exit' : 'page-enter'}`}>
        <PageComponent navigate={navigate} />
      </div>
    </div>
  );
}

export default App;