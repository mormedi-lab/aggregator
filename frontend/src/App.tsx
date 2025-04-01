import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SourceRoundupPage from './pages/SourceRoundupPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/project/:projectId" element={<ProjectDetailPage />} />
        <Route path="/projects/:projectId/sources" element={<SourceRoundupPage />} />
      </Routes>
    </Router>
  );
};

export default App;
