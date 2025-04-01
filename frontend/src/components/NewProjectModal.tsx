import React, { useState } from 'react';

type Props = {
  onClose: () => void;
  onCreate: (name: string, description?: string) => void;
};

const NewProjectModal: React.FC<Props> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), description.trim() || undefined);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px',
        fontFamily: 'Saliec-Light'
      }}>
        <h2 style={{ fontFamily: 'Saliec-Regular' }}>New Project</h2>
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <textarea
          placeholder="Optional description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', height: '80px', marginBottom: '1rem' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;
