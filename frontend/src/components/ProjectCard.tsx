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
      className="bg-[#FAF9F5] hover:bg-white border border-[#E0D8CF] p-5 rounded-lg cursor-pointer hover:shadow-md transition"
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-regular text-[#2D2114]">
          {project.title}
        </h2>
        <button 
          onClick={(e) => onDelete(project.id, project.title, e)}
          className="text-sm text-gray-400 hover:text-black"
        >
          ✕
        </button>
      </div>
      <p className="text-sm text-[#827F7F]">{project.objective}</p>
      <p className="mt-3 text-xs text-[#827F7F]">
        Last accessed: {project.last_accessed}
      </p>
    </div>
  );
};

export default ProjectCard;