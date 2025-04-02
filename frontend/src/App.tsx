import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SourceRoundupPage from './pages/SourceRoundupPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/source-roundup" element={<SourceRoundupPage />} />
      </Routes>
    </Router>
  );
};

export default App;
