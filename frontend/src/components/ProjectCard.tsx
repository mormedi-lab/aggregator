import React from 'react';

type ProjectCardProps = {
  name: string;
  lastAccessed: string;
  description?: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ name, lastAccessed, description }) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      fontFamily: 'Saliec-Light'
    }}>
      <h2 style={{ fontFamily: 'Saliec-Regular', marginBottom: '0.5rem' }}>{name}</h2>
      <p style={{ margin: 0 }}><strong>Last accessed:</strong> {lastAccessed}</p>
      {description && <p style={{ marginTop: '0.5rem' }}>{description}</p>}
    </div>
  );
};

export default ProjectCard;
