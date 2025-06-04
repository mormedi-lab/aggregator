import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { createResearchSpace } from "../api";
import { NewResearchSpaceModalProps } from "../types";

export default function NewResearchSpaceModal({ isOpen, onClose, projectId }: NewResearchSpaceModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("All");

  const isFormValid = query.trim() !== "";

  const resetAndClose = () => {
    setQuery("");
    setSearchType("All");
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const { id: spaceId } = await createResearchSpace(projectId, query, searchType);
      resetAndClose();
      navigate(`/project/${projectId}/space/${spaceId}`);
    } catch (err) {
      console.error("Failed to create research space", err);
    }
  };  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl p-6 relative">
        {/* Close Button */}
        <button onClick={resetAndClose} className="absolute top-4 right-4 text-[#2D2114] hover:text-black">
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-medium text-[#2D2114] border-b border-[#E0D8CF] pb-3 mb-4">
          New Research Space
        </h2>

        {/* Toggle: Search type */}
        <div className="mb-6">
          <label className="text-sm text-[#666565] block mb-1">Select search type</label>
          <div className="flex gap-2">
            {["All", "Internet sources only", "Curated sources only"].map(type => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`px-4 py-[6px] text-sm rounded-full border ${
                  searchType === type
                    ? "bg-[#FF5400] text-white border-[#FF5400]"
                    : "bg-[#FAF9F5] text-[#2D2114] border-[#E0D8CF]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4 mb-6">
            <label className="text-sm text-[#666565] block mb-1">Your Research Question</label>
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={4}
                placeholder="ex. How are energy companies approaching the transition to hydrogen-based fuels in their transportation logistics?"
                className="w-full border border-[#E0D8CF] rounded-md px-4 py-[12px] text-sm leading-[1.2rem] placeholder-[#827F7F] text-[#2D2114]"
            />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`px-6 py-[10px] rounded-md text-sm leading-[1.2rem] font-medium shadow-sm transition ${
              isFormValid
                ? "bg-[#FF5400] hover:bg-[#ff6a1a] text-white cursor-pointer"
                : "bg-[#E0D8CF] text-white cursor-not-allowed"
            }`}
          >
            Generate Sources
          </button>
        </div>
      </div>
    </div>
  );
}
