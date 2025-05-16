import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectLibrary, fetchProjectById, removeSourceFromLibrary } from "../api";
import SourceCard from "../components/SourceCard";
import CuratedSourceCard from "../components/CuratedSourceCard";

interface Source {
  id: string;
  headline: string;
  publisher: string;
  url: string;
  date_published: string;
  summary: string;
  is_curated?: boolean; 
  isInLibrary?: boolean;
}

const LibraryPage = () => {
  const { id: projectId } = useParams();
  const [sources, setSources] = useState<Source[]>([]);
  const [error, setError] = useState("");
  const [projectTitle, setProjectTitle] = useState("");

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const project = await fetchProjectById(projectId!);
        setProjectTitle(project.title);
  
        const res = await getProjectLibrary(projectId!);
        setSources(res);
      } catch (err) {
        console.error("Failed to load library:", err);
        setError("Could not load your library.");
      }
    };
  
    loadLibrary();
  }, [projectId]);

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-semibold text-[#0F1122]">
            Library for <span className="text-[#ff5500]">{projectTitle || "..."}</span>
          </h1>
          {/* Optional future filtering or tag controls could go here */}
        </div>
  
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        ) : sources.length === 0 ? (
          <p className="text-gray-500">You haven’t saved any sources to your library yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sources.map((src, i) =>
              src.is_curated ? (
                <CuratedSourceCard
                  key={`curated-${i}`}
                  source={{ ...src, isInLibrary: true }}
                  onRemove={async () => {
                    try {
                      await removeSourceFromLibrary(projectId!, src.id);
                      setSources(prev => prev.filter((_, index) => index !== i));
                    } catch (err) {
                      console.error("Failed to remove source from library:", err);
                    }
                  }}
                />
              ) : (
                <SourceCard
                  key={`lib-${i}`}
                  source={{ ...src, isInLibrary: true }}
                  onRemove={async () => {
                    try {
                      await removeSourceFromLibrary(projectId!, src.id);
                      setSources(prev => prev.filter((_, index) => index !== i));
                    } catch (err) {
                      console.error("Failed to remove source from library:", err);
                    }
                  }}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
