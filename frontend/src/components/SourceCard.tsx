import {SourceCardProps } from "../types";

export default function SourceCard({ source, variant = "explore", onAdd }: SourceCardProps) {

  return (
    <div className="flex flex-col border border-[#E0D8CF] bg-[#FAF9F5] hover:bg-white rounded-md p-4 shadow-sm transition min-h-[340px]">
      {/* Image placeholder */}
      {source.image_url ? (
        <img
          src={source.image_url}
          alt={source.headline}
          className="h-32 w-full object-cover rounded mb-3"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      ) : null}

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
