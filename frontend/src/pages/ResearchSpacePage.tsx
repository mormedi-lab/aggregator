import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchResearchSpaceById,  fetchSourcesForSpace, addSourceToProject, removeSourceFromProject } from "../api";
import { Source, ResearchSpace } from "../types";
import SourceCard from "../components/SourceCard";

export default function ResearchSpacePage() {
  const { id: projectId, spaceId } = useParams<{ id: string; spaceId: string }>();
  const [space, setSpace] = useState<ResearchSpace | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  const handleRemoveSource = async (sourceId: string) => {
    try {
      await removeSourceFromProject(spaceId!, projectId!, sourceId);
      const data = await fetchSourcesForSpace(spaceId!, projectId!);
      setSources(data.sources);
    } catch (err) {
      console.error("❌ Failed to remove source from project", err);
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
    <div className="h-screen overflow-hidden bg-[#FAF9F5] flex flex-col">
      <div className="flex-1 overflow-y-auto px-8 pt-4 pb-6 flex flex-col">
        {/* Back link (optional) */}
        <div className="text-left">
          <button
            onClick={() => navigate(`/project/${projectId}/dashboard`)}
            className="text-sm text-[#666565] hover:text-[#2D2114] mb-4 block"
          >
            ← Project Dashboard
          </button>
        </div>

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
                onRemove={() => handleRemoveSource(source.id)}
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
    </div>
  );
}
