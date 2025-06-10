import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkHasProjectSources, deleteResearchSpace, fetchProjectById, fetchSourcesForSpace } from "../api";
import NewResearchSpaceModal from "../components/NewResearchSpaceModal";
import { fetchResearchSpaces } from "../api";
import ResearchSpaceCard from "../components/ResearchSpaceCard";
import { Source } from "../types";
import SourceCard from "../components/SourceCard";
import DeleteResearchSpaceWarningModal from "../components/DeleteResearchSpaceWarningModal";

export default function ProjectDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = id ?? "";
  const [title, setTitle] = useState("");
  const [isNewSearchOpen, setNewSearchOpen] = useState(false);
  const [researchSpaces, setResearchSpaces] = useState<any[]>([]);
  const [selectedSpaceIds, setSelectedSpaceIds] = useState<Set<string>>(new Set());
  const [selectedSources, setSelectedSources] = useState<Source[]>([]);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [spacePendingDelete, setSpacePendingDelete] = useState<any | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchProjectById(id as string);
        setTitle(data.title);
      } catch (err) {
        console.error("Failed to load project title", err);
      }
    };
    loadProject();
  }, [id]);  

  useEffect(() => {
    if (!projectId) return; // early exit if undefined
    const loadSpaces = async () => {
      try {
        const spaces = await fetchResearchSpaces(projectId);
        setResearchSpaces(spaces);
      } catch (err) {
        console.error("Failed to load research spaces:", err);
      }
    };
    loadSpaces();
  }, [projectId]); 

  useEffect(() => {
    const loadSourcesForSelectedSpaces = async () => {
      const allSources: Source[] = [];

      for (const spaceId of selectedSpaceIds) {
        const res = await fetchSourcesForSpace(spaceId, projectId);
        const addedSources = res.sources.filter((s: Source) => s.is_in_project);
        allSources.push(...addedSources);
      }

      setSelectedSources(allSources);
    };

    if (selectedSpaceIds.size > 0) {
      loadSourcesForSelectedSpaces();
    } else {
      setSelectedSources([]); // Clear if none selected
    }
  }, [selectedSpaceIds, projectId]);

  const handleDelete = async (spaceId: string) => {
    try {
      await deleteResearchSpace(projectId, spaceId);
      setResearchSpaces((prev) => prev.filter((s) => s.id !== spaceId));
      setSelectedSpaceIds((prev) => {
        const updated = new Set(prev);
        updated.delete(spaceId);
        return updated;
      });
    } catch (err) {
      console.error("❌ Failed to delete research space", err);
    }
  };

  const handleDeleteRequest = async (space: any) => {
    try {
      const hasLinkedSources = await checkHasProjectSources(projectId, space.id);
      if (hasLinkedSources) {
        setSpacePendingDelete(space);
        setWarningModalOpen(true);
      } else {
        await handleDelete(space.id);
      }
    } catch (err) {
      console.error("Error checking source links", err);
    }
  };
   
  return (
    <div className="min-h-screen bg-[#FAF9F5] px-8 py-6">
      {/* Back to projects */}
      <div className="mb-4">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-[#666565] hover:text-[#2D2114]"
        >
          ← Back to All Projects
        </button>
      </div>
  
      {/* Project Title + New Search Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-[#FF5400]">{title || "Loading..."}</h1>
        <button onClick={() => setNewSearchOpen(true)} className="bg-[#FF5400] hover:bg-[#ff6a1a] text-white px-5 py-[8px] rounded-md text-sm leading-[1.2rem] font-medium shadow-sm">
          + New Research Space
        </button>
      </div>

      <NewResearchSpaceModal
        isOpen={isNewSearchOpen}
        onClose={() => setNewSearchOpen(false)}
        projectId={id as string}
      />
  
      {/* Section 1: Research Spaces */}
      <div className="mb-10">
        <h2 className="text-lg font-medium text-[#2D2114]">Research Spaces</h2>
        <hr className="border-t border-[#E0D8CF] mb-4" />
        {Array.isArray(researchSpaces) && researchSpaces.length === 0 ? (
            <p className="text-sm text-[#827F7F]">No research spaces created yet.</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.isArray(researchSpaces) &&
                researchSpaces.map((space) => (
                    <ResearchSpaceCard
                      key={space.id}
                      space={space}
                      selected={selectedSpaceIds.has(space.id)}
                      onClick={() => {
                        setSelectedSpaceIds(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(space.id)) {
                            newSet.delete(space.id);
                          } else {
                            newSet.add(space.id);
                          }
                          return newSet;
                        });
                      }}
                      onVisit={(id) => navigate(`/project/${projectId}/space/${id}`)}
                      onDelete={() => handleDeleteRequest(space)}
                    />
                ))}
            </div>
        )}
      </div>

  
      {/* Section 2: Sources */}
      <div>
        <h2 className="text-lg font-medium text-[#2D2114]">Source Library</h2>
        <hr className="border-t border-[#E0D8CF] mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Chat box placeholder */}
          <div className="border border-[#E0D8CF] rounded-md bg-white p-4 min-h-[200px]">
            <p className="text-sm text-[#827F7F]">[Chat box coming soon]</p>
          </div>
  
          {/* Right: Saved sources placeholder */}
          <div className="space-y-4">
            {selectedSources.length === 0 ? (
              <div className="text-sm text-[#827F7F] mt-1">No sources selected.</div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {selectedSources.map((source) => (
                  <SourceCard key={source.id} source={source} variant="added" onAdd={() => {}} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <DeleteResearchSpaceWarningModal
        isOpen={warningModalOpen}
        onClose={() => {
          setWarningModalOpen(false);
          setSpacePendingDelete(null);
        }}
        onConfirm={() => {
          if (spacePendingDelete) {
            handleDelete(spacePendingDelete.id);
          }
        }}
        spaceTitle={spacePendingDelete?.query}
      />
    </div>
  );
}
