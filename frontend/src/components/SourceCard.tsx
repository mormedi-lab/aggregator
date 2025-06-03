// components/SourceCard.tsx
import React, { useState } from "react";
import { addSourceToLibrary } from "../api";
import { useParams } from "react-router-dom";

interface Source {
  id: string;
  headline: string;
  publisher: string;
  url: string;
  date_published: string;
  summary: string;
  is_curated?: boolean; 
  isInLibrary?: boolean;
}

const SourceCard: React.FC<{ source: Source; onRemove?: () => void }> = ({
  source,
  onRemove,
}) => {
  const { id: projectId } = useParams();
  const [added, setAdded] = useState(source.isInLibrary ?? false);

  const handleAdd = async () => {
    try {
      console.log("Sending to library:", { projectId, sourceId: source.id });
      await addSourceToLibrary(projectId!, source.id);
      setAdded(true);
    } catch (err) {
      console.error("Failed to add to library:", err);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm relative flex flex-col justify-between h-full">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-3 text-gray-400 hover:text-red-500"
        >
          ✕
        </button>
      )}
      <div className="flex-grow">
        <div className="text-sm text-gray-500 mb-1">{source.publisher}</div>
        <div className="font-semibold text-lg text-gray-800 mb-2">
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {source.headline}
          </a>
        </div>

        <div className="text-sm text-gray-600 mb-3">
          {source.summary || "Summary will appear here soon."}
        </div>

        <div className="text-xs text-gray-400 mb-2">{source.date_published}</div>
      </div>
      <button
        onClick={handleAdd}
        disabled={added}
        className={`px-4 py-1 text-sm rounded ${
          added ? "bg-gray-200 text-gray-500" : "bg-[#FF5400] text-white"
        }`}
      >
        {added ? "Added" : "Add to My Library"}
      </button>
    </div>
  );
};

export default SourceCard;
