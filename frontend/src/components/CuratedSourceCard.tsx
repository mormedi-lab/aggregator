import React, { useState } from "react";

interface Source {
  headline: string;
  publisher: string;
  url: string;
  date_published: string;
  summary: string;
  isCurated?: boolean;
}

const CuratedSourceCard: React.FC<{ source: Source; onRemove: () => void }> = ({ source, onRemove }) => {
  const [added, setAdded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm relative bg-[#F3E2D1]">
      <button
        onClick={onRemove}
        className="absolute top-2 right-3 text-gray-400 hover:text-red-500"
      >
        ✕
      </button>

      <div className="text-sm text-gray-500 mb-1">{source.publisher}</div>
      <div className="font-semibold text-lg text-gray-800 mb-2">
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {source.headline}
        </a>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        {source.summary || "Manually curated source."}
      </div>

      <div className="text-xs text-gray-400 mb-2">{source.date_published}</div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={() => setAdded(true)}
          disabled={added}
          className={`px-4 py-1 text-sm rounded ${
            added ? "bg-gray-200 text-gray-500" : "bg-[#F84C39] text-white"
          }`}
        >
          {added ? "Added" : "Add to My Library"}
        </button>
        
      </div>
    </div>
  );
};

export default CuratedSourceCard;