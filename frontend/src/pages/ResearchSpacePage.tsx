import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchResearchSpaceById,  fetchSourcesForSpace, addSourceToProject } from "../api";
import { Source, ResearchSpace } from "../types";
import SourceCard from "../components/SourceCard";

export default function ResearchSpacePage() {
  const { id: projectId, spaceId } = useParams<{ id: string; spaceId: string }>();
  const [space, setSpace] = useState<ResearchSpace | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const navigate = useNavigate();

  const handleAddSource = async (sourceId: string) => {
    try {
      await addSourceToProject(spaceId!,projectId!, sourceId);

      // Refetch sources from backend
      const data = await fetchSourcesForSpace(spaceId!, projectId!);
      console.log("🔁 Refetched sources:", data.sources);
      setSources(data.sources);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    const loadSpaceAndSources = async () => {
      try {
        const loadedSpace = await fetchResearchSpaceById(projectId!, spaceId!);
        setSpace(loadedSpace);
        const res = await fetchSourcesForSpace(spaceId!, projectId!);
        setSources(res.sources);
      } catch (err) {
        console.error("Failed to load sources", err);
      }
        console.error("Failed to load sources", err);
      } finally {
        setLoading(false);
      }
    };
  
    if (projectId && spaceId) loadSpaceAndSources();
  }, [projectId, spaceId]);  

  if (loading || !space) {
    return (
      <div className="p-6 bg-[#FAF9F5] min-h-screen text-[#827F7F]">
        Creating your research space...
      </div>
    );
  }

  const added = sources.filter((s) => s.is_in_project);
  const explore = sources.filter((s) => !s.is_in_project);

  if (!space) return null;

  return (
    <div className="px-6 py-8 bg-[#FAF9F5] min-h-screen">
      {/* Back link (optional) */}
      <button
        onClick={() => navigate(`/project/${projectId}/dashboard`)}
        className="text-sm text-[#666565] hover:text-[#2D2114] mb-4 block"
      >
        ← Project Dashboard
      </button>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-[#2D2114] mb-2">
        {space.space_title || "[Untitled Research Space]"}
      </h1>

      {/* Section 1: Added to Project */}
      <h2 className="text-lg font-medium text-[#2D2114] mt-8">Added to Project</h2>
      <hr className="border-t border-[#E0D8CF] mb-4" />

      {added.length === 0 ? (
        <p className="text-sm text-[#827F7F] mb-6">No sources added to the project yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
          {added.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              variant={source.is_in_project ? "added" : "explore"}
              onAdd={() => handleAddSource(source.id)}
            />
          ))}
        </div>
      )}

      {/* Section 2: Explore Sources */}
      <h2 className="text-lg font-medium text-[#2D2114] mt-10">Explore Sources</h2>
      <hr className="border-t border-[#E0D8CF] mb-4" />

      {explore.length === 0 ? (
        <p className="text-sm text-[#827F7F]">No new sources found for this query.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {explore.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              variant={source.is_in_project ? "added" : "explore"}
              onAdd={() => handleAddSource(source.id)}
            />
          ))}
        </div>
      )}

      {/* Generate More Sources */}
      <div className="flex justify-center mt-10">
        <button className="text-sm text-[#666565] border border-dashed border-[#E0D8CF] rounded-full px-6 py-2">
          + Generate More Sources
        </button>
      </div>
    </div>
  );
}
