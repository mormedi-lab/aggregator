import { useEffect, useState } from "react";
import { fetchProjects, deleteProject, fetchBenchmark } from "../api";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ProjectCard from '../components/ProjectCard';

interface Project {
  id: string;
  title: string;
  industry: string;
  objective: string;
  last_accessed: string;
  hasBenchmark?: boolean;
}

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteClick = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete({ id, name });
    setDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!projectToDelete) return;
  
    try {
      await deleteProject(projectToDelete.id);
      setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
    } catch (err) {
      console.error('Error deleting project:', err);
    } finally {
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };  
  
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const handleProjectClick = async (project: Project) => {
    try {
      // Check if the project has benchmark data
      const benchmarkData = await fetchBenchmark(project.id);
      
      // If benchmark data exists, go directly to sources page
      if (benchmarkData && Object.keys(benchmarkData).length > 0 && benchmarkData.objective) {
        navigate(`/project/${project.id}/sources`);
      } else {
        // Otherwise go to the project details page for editing
        navigate(`/project/${project.id}`);
      }
    } catch (err) {
      console.error('Error checking benchmark status:', err);
      // If there's an error, default to the project details page
      navigate(`/project/${project.id}`);
    }
  };

  // Fetch all projects and check for benchmark data
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        const cleaned = data.filter((p: any) => p.id);
        
        // Check benchmark status for all projects
        const projectsWithStatus = await Promise.all(
          cleaned.map(async (project: Project) => {
            try {
              const benchmarkData = await fetchBenchmark(project.id);
              return {
                ...project,
                hasBenchmark: benchmarkData && Object.keys(benchmarkData).length > 0 && benchmarkData.objective
              };
            } catch (err) {
              console.error(`Error checking benchmark for project ${project.id}:`, err);
              return { ...project, hasBenchmark: false };
            }
          })
        );
        
        setProjects(projectsWithStatus);
      } catch (err) {
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);
  
  return (
    <div className="min-h-screen bg-[#F9F9F9] px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-semibold text-[#0F1122]">
            Your Research Spaces
          </h1>
          <button
            onClick={() => navigate("/new")}
            className="bg-[#F84C39] hover:bg-[#F83A27] text-white px-5 py-2 rounded-md text-sm font-medium shadow-md"
          >
            + New Project
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#F84C39] border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={handleProjectClick}
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No projects found. Create a new project to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        projectName={projectToDelete?.name || ''}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default ProjectsPage;