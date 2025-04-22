import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../api";

function ProjectDefinitionPage() {
  const [title, setTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const navigate = useNavigate();

  //form that sends project data to backend via POST /projects.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject({ title, industry });
      navigate("/projects");
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] px-8 py-2">
        <div className="max-w-screen-xl mx-auto">
            <form
            onSubmit={handleSubmit}
            className="bg-white p-10 rounded-lg shadow-md"
            >
            <h2 className="text-3xl font-semibold mb-8 border-b pb-4">
                New Research Space
            </h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Client name
                </label>
                <input
                type="text"
                placeholder="Eg Nissan, Collins Aerospace; Interior Cabin Division"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-4 py-2 rounded"
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
                className="w-full border px-4 py-2 rounded"
                required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-[#F84C39] text-white py-3 rounded-full hover:bg-[#f64024] transition"
            >
                Create Project
            </button>
            </form>
        </div>
    </div>


  );
}

export default ProjectDefinitionPage;
