import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDefinitionPage from "./pages/ProjectDefinitionPage";
import BenchmarkDefinitionPage from "./pages/BenchmarkDefinitionPage";
import SourceRoundupPage from "./pages/SourceRoundupPage";

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

      <Route
        path="/project/:id/benchmark"
        element={
          <AppLayout>
            <BenchmarkDefinitionPage  />
          </AppLayout>
        }
      />

      <Route
        path="/project/:id/sources"
        element={
          <AppLayout>
            <SourceRoundupPage   />
          </AppLayout>
        }
      />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/projects" replace />} />
    </Routes>
  );
}

export default App;