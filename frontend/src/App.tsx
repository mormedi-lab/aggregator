import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";

function App() {
  return (
    <div className="p-6">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </div>
  );
}

export default App;
