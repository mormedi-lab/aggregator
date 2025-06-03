import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDefinitionPage from "./pages/ProjectDefinitionPage";
import ProjectDashboardPage from "./pages/ProjectDashboardPage";
import SourceRoundupPage from "./pages/SourceRoundupPage";
import LibraryPage from "./pages/LibraryPage";
import AppLayoutWithTopNav from "./layout/AppLayoutWithTopNav";

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
        path="/project/:id/dashboard"
        element={
          <AppLayout>
            <ProjectDashboardPage  />
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

    <Route
      path="/project/:id/library"
      element={
        <AppLayout>
          <LibraryPage />
        </AppLayout>
      }
    />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/projects" replace />} />
    </Routes>
  );
}

export default App;