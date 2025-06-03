import React from "react";

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

const CuratedSourceCard: React.FC<{ source: Source; onRemove: () => void; onAdd?: () => void }> = ({ source, onRemove, onAdd }) => {
  const added = source.isInLibrary;

  return (
    <div className="border border-[#FF5500] rounded-lg p-4 shadow-sm relative bg-[#F3E2D1] flex flex-col justify-between h-full">
      <button
        onClick={onRemove}
        className="absolute top-2 right-3 text-gray-400 hover:text-red-500"
      >
        ✕
      </button>
      <div className="flex-grow">
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
      </div>
      <div className="flex justify-between items-center">
      <button
        onClick={!added ? onAdd : undefined}
        disabled={added}
        className={`w-full px-4 py-1 text-sm rounded ${
          added ? "bg-gray-200 text-gray-500" : "bg-[#FF5400] text-white"
        }`}
      >
        {added ? "Added" : "Add to My Library"}
      </button>
      </div>
    </div>
  );
};

export default CuratedSourceCard;