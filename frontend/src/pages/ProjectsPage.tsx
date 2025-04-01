import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import NewProjectModal from '../components/NewProjectModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { Project } from '../types';
import { fetchProjects, createProject, deleteProject } from '../api';

const ProjectsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleCreate = async (name: string, description?: string) => {
    try {
      const newProject = await createProject(name, description);
      setProjects([newProject, ...projects]);
    } catch (error) {
      console.error(error);
      alert("Error creating project.");
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete._id);
      setProjects(projects.filter(p => p._id !== projectToDelete._id));
      setProjectToDelete(null);
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Error deleting project.");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold font-saliec">Your Projects</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#FF5500] text-white px-4 py-2 rounded-xl hover:bg-[#e64a00] transition-all font-saliec"
        >
          + New Project
        </button>
      </div>

      {/* Project List */}
      <div>
        {loading ? (
          <p className="font-saliec text-gray-500">Loading projects...</p>
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project._id}
              _id={project._id}
              name={project.name}
              lastAccessed={project.lastAccessed}
              description={project.description}
              onDelete={() => setProjectToDelete(project)}
            />
          ))
        ) : (
          <p className="font-saliec text-gray-500">No projects yet.</p>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}

      {/* Delete Modal */}
      {projectToDelete && (
        <ConfirmDeleteModal
          title="Delete this project?"
          description="This will remove the project from your dashboard. This action cannot be undone."
          onCancel={() => setProjectToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
