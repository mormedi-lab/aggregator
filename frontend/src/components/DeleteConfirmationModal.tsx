import React from 'react';

interface DeleteConfirmationModalProps {
  projectName: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  projectName,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-sm w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Warning!</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you would like to delete <br />
          <span className="font-semibold text-[#F84C39]">{projectName}</span>?
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={onConfirm}
            className="bg-[#F84C39] hover:bg-red-700 text-white font-semibold py-2 rounded-md shadow-md"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:underline"
          >
            Nevermind
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
