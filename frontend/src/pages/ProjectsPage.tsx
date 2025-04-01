import React from 'react';
import ProjectCard from '../components/ProjectCard';
import NewProjectModal from '../components/NewProjectModal';
import { useState } from 'react';

const ProjectsPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [projects, setProjects] = useState([
      {
        name: 'Cabin Experience Benchmark',
        lastAccessed: '2025-03-25',
        description: 'In-flight connectivity and personalization case studies',
      },
      {
        name: 'Retail-as-a-Service',
        lastAccessed: '2025-03-15',
      },
    ]);
  
    const handleCreate = (name: string, description?: string) => {
      const newProject = {
        name,
        description,
        lastAccessed: new Date().toISOString().split('T')[0],
      };
      setProjects([newProject, ...projects]);
    };
  
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontFamily: 'Saliec-Regular' }}>Your Projects</h1>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: '0.5rem 1rem', fontFamily: 'Saliec-Regular' }}
          >
            + New Project
          </button>
        </div>
  
        <div style={{ marginTop: '2rem' }}>
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              name={project.name}
              lastAccessed={project.lastAccessed}
              description={project.description}
            />
          ))}
        </div>
  
        {showModal && (
          <NewProjectModal
            onClose={() => setShowModal(false)}
            onCreate={handleCreate}
          />
        )}
      </div>
    );
  };
  

export default ProjectsPage;
