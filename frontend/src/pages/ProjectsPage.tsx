const dummyProjects = [
    {
      title: "Repsol",
      description: "Designing a consortium strategy for COP30",
      lastAccessed: "yesterday",
    },
    {
      title: "Ouigo",
      description:
        "Reimagining the passenger experience onboard mid to long distance trains",
      lastAccessed: "3 days ago",
    },
    {
      title: "Santander",
      description:
        "Proposing new design guidelines for banking branches around the world",
      lastAccessed: "yesterday",
    },
    {
      title: "Mitsubishi Electric",
      description:
        "Uncovering opportunities within circular economies to be implemented at a corporate scale",
      lastAccessed: "3 days ago",
    },
    {
      title: "Collins Digital Ecosystem",
      description:
        "Defining a future vision and solutions for the aircraft cabin experience through design, technology, and data",
      lastAccessed: "3 days ago",
    },
  ];
  
  function ProjectsPage() {
    return (
      <div className="min-h-screen bg-[#F9F9F9] px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-semibold text-[#0F1122]">
              Your Research Spaces
            </h1>
            <button className="bg-[#F84C39] hover:bg-[#F83A27] text-white px-5 py-2 rounded-md text-sm font-medium shadow-md">
              + New Project
            </button>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {dummyProjects.map((project, index) => (
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
                  Last accessed {project.lastAccessed}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default ProjectsPage;
  