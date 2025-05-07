import React from 'react';

interface Project {
  id: string;
  title: string;
  industry: string;
  objective: string;
  last_accessed: string;
  hasBenchmark?: boolean;
}

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  onDelete: (id: string, name: string, e: React.MouseEvent) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onDelete }) => {
  return (
    <div
      onClick={() => onClick(project)}
      className="bg-[#F2F2F2] p-5 rounded-xl shadow-sm border border-[#E6E6E6] cursor-pointer hover:shadow-md transition relative"
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-semibold text-[#0F1122]">
          {project.title}
        </h2>
        <button 
          onClick={(e) => onDelete(project.id, project.title, e)}
          className="text-sm text-gray-400 hover:text-black"
        >
          ✕
        </button>
      </div>
      <p className="text-sm text-[#555]">{project.industry}</p>
      <p className="mt-3 text-xs text-[#999]">
        Last accessed: {project.last_accessed}
      </p>
    </div>
  );
};

export default ProjectCard;