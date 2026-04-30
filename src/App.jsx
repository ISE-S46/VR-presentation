import { BrowserRouter, Routes, Route } from 'react-router';
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

function App() {
  return (
    <BrowserRouter>
      <div className="app-root">

        {/* Background elements stay persistent across all pages */}
        <div className="bg-animation">
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
          <div className="bg-orb bg-orb-3"></div>
        </div>

        <LiveClock />

        {/* The page-enter class ensures your fade-in animation still plays on route change */}
        <div className="page-transition page-enter">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Introduction" element={<Introduction />} />
            <Route path="/OurPartners" element={<OurPartners />} />
            <Route path="/OurProjects" element={<OurProjects />} />
            <Route path="/OurProjects/ProjectDetail" element={<ProjectDetail />} />
            <Route path="/OurProjects/DemoProject" element={<DemoProject />} />
            <Route path="/OurProjects/CollaborationOpportunities" element={<CollaborationOpportunities />} />
            <Route path="/QnA" element={<QnA />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;