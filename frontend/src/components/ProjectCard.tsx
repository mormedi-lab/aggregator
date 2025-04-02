import React from 'react';
import { useNavigate } from 'react-router-dom';

type ProjectCardProps = {
  _id: string;
  name: string;
  lastAccessed: string;
  description?: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ _id, name, lastAccessed, description }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/project/${_id}`)}
      className="cursor-pointer border border-gray-300 rounded-2xl p-4 mb-4 transition-all duration-200 hover:shadow-md hover:border-gray-400 font-saliec-light"
    >
      <h2 className="text-2xl font-saliec mb-1">{name}</h2>
      <p className="text-sm font-saliec text-gray-400">
        <span className="font-saliec">Last accessed:</span> {lastAccessed}
      </p>
      {description && (
        <p className="mt-2 text-sm text-gray-800">{description}</p>
      )}
    </div>
  );
};

export default ProjectCard;
