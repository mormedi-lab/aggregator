import React from "react";
import { useLocation, useParams } from "react-router-dom";

const SourceRoundupPage = () => {
  const { id: projectId } = useParams();
  const location = useLocation();
  const sources: string[] = location.state?.sources || [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Sources for project {projectId}</h1>

      {sources.length === 0 ? (
        <p className="text-gray-500">No sources found for this benchmark.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sources.map((url, idx) => (
            <div
              key={idx}
              className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {url}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SourceRoundupPage;
