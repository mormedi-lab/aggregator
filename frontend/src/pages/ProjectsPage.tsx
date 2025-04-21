import { useEffect, useState } from "react";
import { fetchProjects } from "../api";
import { useNavigate } from "react-router-dom";

type Project = {
  title: string;
  description: string;
  last_accessed: string;
};

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects()
      .then((data) => setProjects(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9] px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-semibold text-[#0F1122]">
            Your Research Spaces
          </h1>
          <button
            onClick={() => navigate("/new")}
            className="bg-[#F84C39] hover:bg-[#F83A27] text-white px-5 py-2 rounded-md text-sm font-medium shadow-md"
          >
            + New Project
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-[#F2F2F2] p-5 rounded-xl shadow-sm border border-[#E6E6E6]"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-[#0F1122]">
                    {project.title}
                  </h2>
                  <button className="text-sm text-gray-400 hover:text-black">
                    ✕
                  </button>
                </div>
                <p className="text-sm text-[#555]">{project.description}</p>
                <p className="mt-3 text-xs text-[#999]">
                  Last accessed {project.last_accessed}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;
