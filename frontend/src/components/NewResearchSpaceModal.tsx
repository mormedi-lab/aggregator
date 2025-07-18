import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { createResearchSpace } from "../api";
import { NewResearchSpaceModalProps } from "../types";

export default function NewResearchSpaceModal({ isOpen, onClose, projectId, projectIndustries }: NewResearchSpaceModalProps) {
  const navigate = useNavigate();
  const [researchQuestion, setResearchQuestion] = useState("");
  const [searchType, setSearchType] = useState("Internet sources only");
  const [geographies, setGeographies] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState("");
  const [insightStyle, setInsightStyle] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const industries = [
    "Mobility", "Finance", "Retail", "Auto", "Rail",
    "Aviation", "Energy", "Consumer Goods", "Consumer Services", "Other"
  ];

  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  useEffect(() => {
    if (
      isOpen &&
      projectIndustries &&
      typeof projectIndustries === "string"
    ) {
      const parsed = (projectIndustries as string).split(",").map((s: string) => s.trim());
      setSelectedIndustries(parsed);
    } else if (isOpen && Array.isArray(projectIndustries)) {
      setSelectedIndustries(projectIndustries);
    }
  }, [isOpen, projectIndustries]);

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const isFormValid = researchQuestion.trim() !== "";

  const resetAndClose = () => {
    setResearchQuestion("");
    setSearchType("All");
    onClose();
  };

  const handleSubmit = async () => {
    try {

      const formData = {
        research_question: researchQuestion,
        industries: selectedIndustries,
        geographies,
        timeframe,
        insight_style: insightStyle,
        additional_notes: additionalNotes,
        search_type: searchType,
        space_title: "",
      };

      const space = await createResearchSpace(projectId, formData);

      // Immediately go to the loading screen
      resetAndClose();
      navigate(`/project/${projectId}/space/${space.id}/loading`);
    } catch (err) {
      console.error("Failed to create research space", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl p-6 relative">
        {/* Close Button */}
        <button onClick={resetAndClose} className="absolute top-4 right-4 text-[#2D2114] hover:text-black">
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-medium text-[#2D2114] border-b border-[#E0D8CF] pb-3 mb-4">
          New Research Space
        </h2>

        {/* Toggle: Search type */}
        <div className="mb-4">
          <label className="text-sm text-[#666565] block mb-1">Select search type</label>
          <div className="flex gap-2">
            {["All", "Internet sources only", "Trusted sources only"].map(type => {
              const isDisabled = type !== "Internet sources only";

              return (
                <button
                  key={type}
                  onClick={() => !isDisabled && setSearchType(type)}
                  disabled={isDisabled}
                  className={`px-4 py-[6px] text-sm rounded-full border transition
                    ${searchType === type ? "bg-[#FF5400] text-white border-[#FF5400]" : "bg-[#FAF9F5] text-[#2D2114] border-[#E0D8CF]"}
                    ${isDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-[#191B44] "}
                  `}
                >
                  {type}
                </button>
              );
            })}

          </div>
        </div>

        {/* Guided Prompt Fields */}
        <div className="space-y-6 mb-6">

        {/* 1. Main Research Question */}
        <div className="mb-1">
          <label className="text-sm text-[#666565] block mb-1">Describe the main question or topic you’re exploring</label>
          <textarea
            value={researchQuestion}
            onChange={(e) => setResearchQuestion(e.target.value)}
            rows={3}
            placeholder="e.g. How are banks in Europe adapting their service models to meet Gen Z expectations?"
            className="w-full border border-[#E0D8CF] rounded-md px-4 py-[12px] text-sm leading-[1.2rem] placeholder-[#827F7F] text-[#2D2114]"
          />
        </div>

        {/* 2. Industry Pills – to be made dynamic */}
        <div className="mb-4">
          <label className="text-sm text-[#666565] block mb-1">Which industries are most relevant to your question?</label>
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


        {/* 3. Geographic Focus */}
        <div className="mb-3">
          <label className="text-sm text-[#666565] block mb-1">Any specific regions or markets to focus on?</label>
          <select
            className="w-full border border-[#E0D8CF] rounded-md px-4 py-[10px] text-sm text-[#2D2114] bg-white"
            value={geographies[0] || ""}
            onChange={(e) => setGeographies([e.target.value])}
          >
            <option value="" disabled>Select a region (optional)</option>
            <option>Global</option>
            <option>Europe</option>
            <option>United States</option>
            <option>Japan</option>
            <option>Middle East</option>
            <option>APAC</option>
            <option>Latin America</option>
          </select>
        </div>

        {/* 4. Timeframe */}
        <div className="mb-3">
          <label className="text-sm text-[#666565] block mb-1">Is your question tied to a specific time period?</label>
          <select
            className="w-full border border-[#E0D8CF] rounded-md px-4 py-[10px] text-sm text-[#2D2114] bg-white"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="" disabled>Select a timeframe</option>
            <option>No preference</option>
            <option>Last 12 months</option>
            <option>Last 3–5 years</option>
            <option>Future outlook (2025+)</option>
          </select>
        </div>

        {/* 5. Expected Insights */}
        <div className="mb-2">
          <label className="text-sm text-[#666565] block mb-1">
            Imagine you’re reading a great article that fully answers your question — what would it include?
          </label>
          <textarea
            rows={3}
            value={insightStyle}
            onChange={(e) => setInsightStyle(e.target.value)}
            placeholder="e.g. Recent examples, expert quotes, data trends, future scenarios, challenges companies are facing…"
            className="w-full border border-[#E0D8CF] rounded-md px-4 py-[12px] text-sm leading-[1.2rem] placeholder-[#827F7F] text-[#2D2114]"
          />
        </div>

        {/* 6. Freeform Notes */}
        <div className="mb-3">
          <label className="text-sm text-[#666565] block mb-1">Anything else you'd like to add?</label>
          <textarea
            rows={2}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Enter any other critical information you would like to include in your search query"
            className="w-full border border-[#E0D8CF] rounded-md px-4 py-[10px] text-sm text-[#2D2114] placeholder-[#827F7F]"
          />
        </div>
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
