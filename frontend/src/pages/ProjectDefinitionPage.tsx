import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../api";

function ProjectDefinitionPage() {
  const [clientName, setClientName] = useState("");
  const [industry, setIndustry] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject({
        title: clientName,
        description: industry,
      });
      navigate("/projects");
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl"
      >
        <h2 className="text-3xl font-semibold text-[#0F1122] mb-8 border-b pb-2">
          New Research Space
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client name
          </label>
          <input
            type="text"
            placeholder="Eg Nissan, Collins Aerospace; Interior Cabin Division"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F84C39]"
            required
          />
        </div>

        <div className="mb-10">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <input
            type="text"
            placeholder="Eg Retail, Rail, Mobility"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F84C39]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#F84C39] text-white py-3 rounded-full text-sm font-medium shadow hover:bg-[#F83A27] transition"
        >
          Create Project
        </button>
      </form>
    </div>
  );
}

export default ProjectDefinitionPage;
