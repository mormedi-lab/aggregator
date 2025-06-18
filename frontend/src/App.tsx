import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDashboardPage from "./pages/ProjectDashboardPage";
import ResearchSpacePage from "./pages/ResearchSpacePage";
import ResearchSpaceLoadingPage from "./pages/ResearchSpaceLoadingPage";

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
        path="/project/:id/dashboard"
        element={
          <AppLayout>
            <ProjectDashboardPage  />
          </AppLayout>
        }
      />

      <Route
        path="/project/:id/space/:spaceId/loading"
        element={
          <AppLayout>
            <ResearchSpaceLoadingPage />
          </AppLayout>
        }
      />

      <Route
        path="/project/:id/space/:spaceId"
        element={
          <AppLayout>
            <ResearchSpacePage />
          </AppLayout>
        }
      />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/projects" replace />} />
    </Routes>
  );
}

export default App;