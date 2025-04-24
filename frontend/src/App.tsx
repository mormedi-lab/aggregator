import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDefinitionPage from "./pages/ProjectDefinitionPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/projects"
        element={
          <AppLayout>
            <ProjectsPage />
          </AppLayout>
        }
      />

      <Route
        path="/new"
        element={
          <AppLayout>
            <ProjectDefinitionPage />
          </AppLayout>
        }
      />

      <Route
        path="/project/:id"
        element={
          <AppLayout>
            <ProjectDefinitionPage />
          </AppLayout>
        }
      />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/projects" replace />} />
    </Routes>
  );
}

export default App;