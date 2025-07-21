import { useState } from "react";
import { SourceCardProps } from "../types";
import { MoreHorizontal } from "lucide-react";

export default function SourceCard({ source, variant = "explore", onAdd, onRemove }: SourceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="flex flex-col border border-[#E0D8CF] bg-[#FAF9F5] hover:bg-white rounded-md p-4 shadow-sm transition relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMenuOpen(false);
      }}
    >
      {/* Menu icon (only if source is already added to project) */}
      {variant === "added" && isHovered && (
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="p-1 rounded hover:bg-[#E0D8CF]"
          >
            <MoreHorizontal size={16} className="text-[#666565]" />
          </button>
        </div>
      )}

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute top-9 right-2 bg-white border border-[#E0D8CF] rounded-md shadow-lg z-10 w-32">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              onRemove?.(); // Call onRemove handler passed from parent
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#FAF9F5]"
          >
            Remove
          </button>
        </div>
      )}

      {/* Source content */}
      <div className="flex flex-col flex-grow">
        <div className="text-xs text-[#666565] mb-1">{source.publisher}</div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#2D2114] mb-1 hover:underline"
        >
          {source.headline}
        </a>
        <div className="text-sm text-[#827F7F] mb-2">{source.summary}</div>
        <div className="text-xs text-[#827F7F]">{source.date_published || "MM-DD-YYYY"}</div>
      </div>

      {/* Add badge or button */}
      <div className="mt-auto pt-4">
        {variant === "added" ? (
          <span className="text-xs px-3 py-1 rounded bg-[#E0D8CF] text-[#2D2114] inline-block">Added</span>
        ) : (
          <button
            onClick={onAdd}
            className="text-xs bg-[#FF5400] text-white px-4 py-1 rounded shadow-sm hover:bg-[#ff6a1a]"
          >
            Add to My Project
          </button>
        )}
      </div>
    </div>
  );
}
