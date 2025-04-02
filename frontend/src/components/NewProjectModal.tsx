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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md font-saliec shadow-lg">
        <h2 className="text-xl font-semibold mb-4">New Project</h2>
        
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
        />
        
        <textarea
          placeholder="Optional description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-saliec hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#FF5500] text-white px-4 py-2 rounded-lg text-sm font-saliec hover:bg-[#e64a00] transition-all"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;
