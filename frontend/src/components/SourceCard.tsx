import {SourceCardProps } from "../types";

export default function SourceCard({ source, variant = "explore", onAdd }: SourceCardProps) {
  return (
    <div className="flex flex-col border border-[#E0D8CF] bg-[#FAF9F5] hover:bg-white rounded-md p-4 shadow-sm transition min-h-[340px]">
      {/* Image placeholder */}
      <div className="h-32 bg-[#E0D8CF] rounded mb-3" />

      <div className="flex flex-col flex-grow">
        <div className="text-xs text-[#666565] mb-1">{source.publisher}</div>
        <div className="font-semibold text-[#2D2114] mb-1">{source.headline}</div>
        <div className="text-sm text-[#827F7F] mb-2">{source.summary}</div>
        <div className="text-xs text-[#827F7F]">{source.date_published || "MM-DD-YYYY"}</div>
      </div>

      {/* Button pinned to bottom */}
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
