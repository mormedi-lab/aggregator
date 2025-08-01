import { useEffect, useState } from "react";
import { fetchProjects, deleteProject } from "../api";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ProjectCard from '../components/ProjectCard';
import SearchBar from "../components/SearchBar";
import SortBy from "../components/SortBy";
import NewProjectModal from "../components/NewProjectModal";
import { Project } from "../types";

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isNewProjectOpen, setNewProjectOpen] = useState(false);

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

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}/dashboard`);
  };

  // Fetch all projects 
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        const cleaned = data.filter((p: any) => p.id);
        setProjects(cleaned);
      } catch (err) {
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };
  
    loadProjects();
  }, []);
  
  return (
    <div className="min-h-screen bg-[#FAF9F5] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-regular text-[#2D2114]">All Projects</h1>
          <button
            onClick={() => setNewProjectOpen(true)}
            className="bg-[#FF5400] hover:bg-[#ff6a1a] text-white px-5 py-[10px] rounded-md text-sm leading-[1.2rem] font-medium shadow-sm"
          >
            + New Project
          </button>
        </div>
        <div className="mb-4">
          <SearchBar />
        </div>
        <SortBy />
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FF5400] border-t-transparent mx-auto"></div>
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

      <NewProjectModal isOpen={isNewProjectOpen} onClose={() => setNewProjectOpen(false)} />

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