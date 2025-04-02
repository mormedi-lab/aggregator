import React from 'react';
import { useLocation } from 'react-router-dom';

const SourceRoundupPage: React.FC = () => {
  const location = useLocation();
  const sources = location.state?.sources || [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-saliec mb-6">Source Roundup</h1>
      {sources.length === 0 ? (
        <p className="text-gray-500 font-saliec-light">No sources found.</p>
      ) : (
        <ul className="space-y-4">
          {sources.map((url: string, index: number) => (
            <li
              key={index}
              className="p-4 border border-gray-300 rounded-xl font-saliec-light hover:shadow-md transition-all"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {url}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SourceRoundupPage;
