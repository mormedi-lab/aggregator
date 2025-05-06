import React, { useState } from 'react';

interface AddUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (url: string) => void;
}

const AddUrlModal: React.FC<AddUrlModalProps> = ({ isOpen, onClose, onAddSource }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic URL validation
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    // Check if URL has a valid format
    if (!url.match(/^(http|https):\/\/[^ "]+$/)) {
      setError('Please enter a valid URL including http:// or https://');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      await onAddSource(url);
      setUrl('');
      onClose();
    } catch (err) {
      setError('Failed to add source. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add Source URL</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter the URL of the source you want to add
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={isLoading}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded bg-[#F84C39] text-white ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#f64024]'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Source'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUrlModal;