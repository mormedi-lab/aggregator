import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SourceCard from '../components/SourceCard';

type Source = {
  url: string;
  title?: string;
};

const SourceRoundupPage: React.FC = () => {
  const location = useLocation();
  const sources: Source[] = location.state?.sources || [];

  const [library, setLibrary] = useState<Source[]>([]);

  const addToLibrary = (source: Source) => {
    if (!library.find((s) => s.url === source.url)) {
      setLibrary((prev) => [...prev, source]);
    }
  };

  const removeFromLibrary = (url: string) => {
    setLibrary((prev) => prev.filter((source) => source.url !== url));
  };  

  return (
    <div className="p-8 flex gap-8">
      {/* Main column: Source Results */}
      <div className="flex-1">
        <h1 className="text-2xl font-saliec mb-6">Source Roundup</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((source, idx) => (
            <div key={idx} className="relative">
              <SourceCard url={source.url} title={source.title} />
              <button
                onClick={() => addToLibrary(source)}
                className="absolute top-2 right-2 text-sm bg-gray-200 hover:bg-gray-300 rounded px-2 py-1"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right column: Library */}
      <div className="w-80 border-l pl-4">
        <h2 className="text-xl font-saliec mb-4">Library</h2>
        {library.length === 0 ? (
          <p className="text-gray-500 text-sm">No sources saved yet.</p>
        ) : (
          <ul className="space-y-3">
            {library.map((source, idx) => (
              <li key={idx} className="relative">
                <SourceCard url={source.url} title={source.title} />
                <button
                  onClick={() => removeFromLibrary(source.url)}
                  className="absolute top-2 right-2 text-sm bg-red-100 hover:bg-red-200 text-red-600 rounded px-2 py-1"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SourceRoundupPage;
