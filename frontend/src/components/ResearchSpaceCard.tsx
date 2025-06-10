import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { ResearchSpaceCardProps } from "../types";

export default function ResearchSpaceCard({ space, onClick, onVisit, onDelete, selected }: ResearchSpaceCardProps) {
  const [isHovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setMenuOpen(false);
      }}
      onClick={() => onClick(space.id)}
      className={`relative cursor-pointer rounded-md p-4 border border-[#E0D8CF] transition-shadow ${
        selected ? "bg-white shadow-sm" : "bg-[#FAF9F5] hover:bg-white hover:shadow-sm"
      }`}
    >
      {/* Hover menu icon */}
      {isHovered && (
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
              onVisit?.(space.id);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-[#2D2114] hover:bg-[#FAF9F5]"
          >
            Visit
          </button>
          <div className="border-t border-[#E0D8CF]"></div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              onDelete?.(space.id);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#FAF9F5]"
          >
            Delete
          </button>
        </div>
      )}
  
      {/* Card content */}
      <div className="font-normal text-[#2D2114] text-base line-clamp-1">
        {space.query || "[Untitled Research Space]"}
      </div>
      <div className="text-xs text-[#827F7F] mt-1">{space.search_type}</div>
    </div>
  )
}
