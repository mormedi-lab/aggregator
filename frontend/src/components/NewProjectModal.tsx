import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../api";
import { X } from "lucide-react";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [title, setTitle] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [objective, setObjective] = useState("");

  const isFormValid = title.trim() !== "" && selectedIndustries.length > 0 && objective.trim() !== "";
  const resetForm = () => {
    setTitle("");
    setSelectedIndustries([]);
    setObjective("");
  };  

  const navigate = useNavigate();

  const industries = [
    "Mobility", "Finance", "Retail", "Auto", "Rail",
    "Aviation", "Energy", "Consumer Goods", "Consumer Services", "Other"
  ];

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const handleSubmit = async () => {
    try {
      const industry = selectedIndustries.join(", ");
      const projectId = await createProject({ title, industry, objective });
      onClose();
      navigate(`/project/${projectId}/benchmark`);
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl p-6 relative">  
        {/* Close Button */}
        <button 
            onClick={() => {
                resetForm();
                onClose();
            }}
            className="absolute top-4 right-4 text-[#2D2114] hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-medium text-[#2D2114] border-b border-[#E0D8CF] pb-3 mb-4">
          New Project
        </h2>

        <div className="space-y-6">
          {/* Client Name */}
          <div>
            <label className="text-sm text-[#666565] block mb-1">Client Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex. Repsol, Iberdrola, Collins Aerospace; Cabin Experience Dept"
              className="w-full border border-[#E0D8CF] rounded-md px-4 py-[12px] text-sm leading-[1.2rem] placeholder-[#827F7F] text-[#2D2114]"
            />
          </div>

          {/* Industry tags */}
          <div>
            <label className="text-sm text-[#666565] block mb-2">
              Industry <span className="text-xs text-[#999]">(Select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => toggleIndustry(industry)}
                  className={`px-3 py-[6px] text-sm rounded-full border transition ${
                    selectedIndustries.includes(industry)
                      ? "bg-[#191B44] text-white border-[#191B44]"
                      : "bg-[#FAF9F5] text-[#2D2114] border-[#E0D8CF]"
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label className="text-sm text-[#666565] block mb-1">Project Description</label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={4}
              placeholder="ex. How digital technologies—specifically embedded sensors, real-time diagnostics, and AI—can transform aircraft cabin maintenance from a reactive to a proactive model"
              className="w-full border border-[#E0D8CF] rounded-md px-4 py-[12px] text-sm leading-[1.2rem] placeholder-[#827F7F] text-[#2D2114]"
            />
          </div>

          {/* Continue Button */}
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
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
