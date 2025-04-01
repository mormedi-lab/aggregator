import React from 'react';
import { useNavigate } from 'react-router-dom';
import trashIcon from '../assets/icons/trash.png';

type ProjectCardProps = {
  _id: string;
  name: string;
  lastAccessed: string;
  description?: string;
  onDelete?: () => void;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  _id,
  name,
  lastAccessed,
  description,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative border border-gray-300 rounded-2xl p-4 mb-4 transition-all duration-200 hover:shadow-md hover:border-gray-400 font-saliec-light"
    >
      {/* Trash icon (top right corner) */}
      {onDelete && (
        <img
          src={trashIcon}
          alt="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-3 right-3 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100"
        />
      )}

      {/* Project card content */}
      <div onClick={() => navigate(`/project/${_id}`)} className="cursor-pointer">
        <h2 className="text-2xl font-saliec mb-1">{name}</h2>
        <p className="text-sm font-saliec text-gray-400">
          <span className="font-saliec">Last accessed:</span> {lastAccessed}
        </p>
        {description && (
          <p className="mt-2 text-sm text-gray-800">{description}</p>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
