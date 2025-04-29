import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProject, fetchProjectById, updateProject } from "../api";

function ProjectDefinitionPage() {
  const [title, setTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [objective, setObjective] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { id } = useParams(); // now using ID from route

  // Fetch project if ID is in the URL (edit mode)
  useEffect(() => {
    if (id) {
      fetchProjectById(id)
        .then((data) => {
          setTitle(data.title);
          setIndustry(data.industry);
          setObjective(data.objective);
          setProjectId(data.id); // keep track of it
        })
        .catch((err) => {
          console.error("Failed to load project:", err);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (projectId) {
        await updateProject({ id: projectId, title, industry, objective });
      } else {
        await createProject({ title, industry, objective });
      }
      navigate("/projects");
    } catch (err) {
      console.error("Error saving project:", err);
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
            {projectId ? "Edit Research Space" : "New Research Space"}
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <div className="mb-10">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Objective
            </label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F84C39] text-white py-3 rounded-full hover:bg-[#f64024] transition"
          >
            {projectId ? "Update Project" : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProjectDefinitionPage;
