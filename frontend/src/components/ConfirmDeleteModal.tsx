import React from 'react';

type ConfirmDeleteModalProps = {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  title,
  description,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-lg font-saliec">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-black transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#FF5500] text-white px-4 py-2 rounded-xl hover:bg-[#e64a00] transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
