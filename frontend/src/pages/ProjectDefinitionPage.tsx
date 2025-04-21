import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../api";

function ProjectDefinitionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject({ title, description });
      navigate("/projects");
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold mb-6">Create New Project</h2>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 mb-4 rounded"
          required
        />
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 mb-4 rounded"
          rows={4}
          required
        />
        <button
          type="submit"
          className="bg-[#F84C39] text-white px-4 py-2 rounded hover:bg-[#F83A27]"
        >
          Create Project
        </button>
      </form>
    </div>
  );
}

export default ProjectDefinitionPage;
