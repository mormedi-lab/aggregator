import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDefinitionPage from "./pages/ProjectDefinitionPage";

function App() {
  return (
    <div className="p-6">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/new" element={<ProjectDefinitionPage />} />
      </Routes>
    </div>
  );
}

export default App;
