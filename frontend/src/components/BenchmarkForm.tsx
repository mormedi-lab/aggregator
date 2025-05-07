import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBenchmark, saveBenchmark } from "../api";

const BenchmarkForm = () => {
  const [formData, setFormData] = useState({
    objective: "",
    companies: "",
    industries: "",
    geographies: "",
    timeframe: "",
    source_type: "all", // "all" | "internet" | "curated"
  });

  const { id: projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) return;
  
    fetchBenchmark(projectId)
      .then((data) => {
        if (data?.objective) {
          setFormData({
            objective: data.objective,
            companies: data.companies,
            industries: data.industries,
            geographies: data.geographies,
            timeframe: data.timeframe,
            source_type: data.source_type,
          });
        }
      })
      .catch((err) => {
        console.error("Error loading benchmark:", err);
      });
  }, [projectId]);  
    

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSourceType = (type: string) => {
    setFormData({ ...formData, source_type: type });
  };

  const isFormEmpty = () => {
    const { source_type, ...textFields } = formData;
    return Object.values(textFields).every((val) => val.trim() === "");
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormEmpty()) {
      alert("Please fill in at least one benchmark field before continuing.");
      return;
    }
  
    // Save benchmark first
    try {
      await saveBenchmark({ project_id: projectId!, ...formData });
      
      // Navigate immediately to SourceRoundupPage with loading
      navigate(`/project/${projectId}/sources`, { state: { loading: true } });
    } catch (err) {
      console.error("Failed to save benchmark:", err);
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-2 font-medium">Select search type</label>
        <div className="flex gap-4">
          {["all", "internet", "curated"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleSourceType(type)}
              className={`px-4 py-2 rounded-full border ${
                formData.source_type === type
                  ? "bg-[#F84C39] text-white"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {type === "all"
                ? "All"
                : type === "internet"
                ? "Internet sources only"
                : "Curated sources only"}
            </button>
          ))}
        </div>
      </div>

      {[
        { label: "1. What is the main objective of this benchmark?", name: "objective" },
        { label: "2. Are there any specific companies you want to investigate or compare?", name: "companies" },
        { label: "3. What industry or sector(s) are most relevant to this benchmark?", name: "industries" },
        { label: "4. Do you want to include or exclude any specific geographies or markets?", name: "geographies" },
        { label: "5. Are you looking for any specific time frame or recency?", name: "timeframe" },
      ].map(({ label, name }) => (
        <div key={name}>
          <label className="block mb-1 font-medium">{label}</label>
          <input
            type="text"
            name={name}
            value={(formData as any)[name]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Type your answer here"
          />
        </div>
      ))}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isFormEmpty()}
          className={`px-6 py-2 rounded text-white transition ${
            isFormEmpty()
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#F84C39] hover:bg-[#f64024]"
          }`}
        >
          Start Research
        </button>

        <button
          type="button"
          onClick={() =>
            setFormData({
              objective: "",
              companies: "",
              industries: "",
              geographies: "",
              timeframe: "",
              source_type: "all",
            })
          }
          className="text-gray-500 underline"
        >
          Clear All
        </button>
      </div>
    </form>
  );
};

export default BenchmarkForm;
