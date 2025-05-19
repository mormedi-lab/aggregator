import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { generatePrompt, postAndSaveSources, fetchProjectById, getSavedSources, getProjectLibrary, fetchMetadataFromUrl } from "../api";
import { API } from "../api";
import SourceCard from "../components/SourceCard";
import CuratedSourceCard from "../components/CuratedSourceCard";
import AddUrlModal from "../components/AddUrlModal";
import PromptSearchBar from "../components/PromptSearchBar";

interface LocationState {
  loading?: boolean;
}

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

const SourceRoundupPage = () => {
  const { id: projectId } = useParams();
  const location = useLocation();
  const locationState = location.state as LocationState;
  
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(locationState?.loading ?? true);
  const [error, setError] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [isAddUrlModalOpen, setIsAddUrlModalOpen] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);

  //scroll to bottom of page when new sources are generated via text prompt
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Fetch project info
        const projectData = await fetchProjectById(projectId!);
        setProjectTitle(projectData.title);

        const projectSources = await getSavedSources(projectId!);
        const librarySources = await getProjectLibrary(projectId!);
        const libraryIds = new Set(librarySources.map((s: any) => s.id));

        // 2. Try to get saved sources
        if (projectSources.length > 0) {
          const formatted = projectSources.map((src: any) => ({
            id: src.id,
            headline: src.headline,
            publisher: new URL(src.url).hostname.replace("www.", ""),
            url: src.url,
            date_published: src.date_published || "",
            summary: src.summary || "Summary will appear soon.",
            isInLibrary: libraryIds.has(src.id),
            is_curated: src.is_curated || false
          }));
          setSources(formatted);
        } else {
          // 3. Generate prompt and save sources if none exist
          const promptRes = await generatePrompt(projectId!);
          await postAndSaveSources(projectId!, promptRes.prompt);

          //  Immediately fetch saved state from DB, right after live generation
          const refreshed = await getSavedSources(projectId!);
          const formatted = refreshed.map((src: any) => ({
            id: src.id,
            headline: src.headline,
            publisher: new URL(src.url).hostname.replace("www.", ""),
            url: src.url,
            date_published: "",
            summary: src.summary || "",
            isInLibrary: libraryIds.has(src.id)
          }));
          setSources(formatted);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading sources.");
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, [projectId]);  
  

  // Function to handle adding a curated source from URL
  const handleAddCuratedSource = async (url: string) => {
    try {
      const meta = await fetchMetadataFromUrl(url);
      const today = new Date().toISOString().split("T")[0];
  
      const tempSource: Source = {
        id: crypto.randomUUID(),
        headline: meta.headline,
        publisher: meta.publisher,
        url,
        date_published: today,
        summary: meta.summary || "No summary available.",
        is_curated: true
      };
  
      // Don’t add it to state yet — wait for real ID
      const response = await fetch(`${API}/project/${projectId}/library/add-curated`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          source: {
            headline: tempSource.headline,
            publisher: tempSource.publisher, 
            url: tempSource.url,
            summary: tempSource.summary
          }
         }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add source to library");
      }
  
      const newSource: Source = {
        ...tempSource,
        id: data.source_id,
        isInLibrary: true,
      };
  
      // Update state with the final source
      setSources(prev => [...prev, newSource]);
  
    } catch (error) {
      console.error("Error adding curated source:", error);
    }
  };  

  //re-add curated source to library
  const handleAddToLibrary = async (sourceId: string) => {
    try {
      await fetch(`${API}/project/${projectId}/library/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_id: sourceId }),
      });
  
      setSources(prev =>
        prev.map(s =>
          s.id === sourceId ? { ...s, isInLibrary: true } : s
        )
      );
    } catch (err) {
      console.error("Failed to re-add curated source to library:", err);
    }
  };  

  //query new source cards from within the curation page
  const handleQuerySearch = async (query: string) => {
    setIsQuerying(true);
    try {
      const response = await fetch(`${API}/find_sources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          search_prompt: query,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch sources");
  
      const librarySources = await getProjectLibrary(projectId!);
      const libraryIds = new Set(librarySources.map((s: any) => s.id));
  
      const formattedNewSources = data.sources.map((src: any) => ({
        id: crypto.randomUUID(), // fallback in case the backend doesn’t provide ID
        headline: src.headline,
        publisher: new URL(src.url).hostname.replace("www.", ""),
        url: src.url,
        date_published: src.date_published || "",
        summary: src.summary || "Summary coming soon...",
        isInLibrary: false,
        is_curated: false,
      }));
  
      // Append to the current list
      setSources(prev => [...prev, ...formattedNewSources]);
    } catch (error) {
      console.error("Error fetching sources:", error);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-semibold text-[#0F1122]">
              {projectTitle ? (
              <>
                <span className="text-[#0F1122]">Sources for </span>
                <span className="text-[#ff5500]">{projectTitle}</span>
              </>
            ) : (
              <span className="text-[#0F1122]">Research Sources</span>
            )}
            </h1>
            <button
              onClick={() => setIsAddUrlModalOpen(true)}
              className="bg-[#F84C39] hover:bg-[#F83A27] text-white px-5 py-2 rounded-md text-sm font-medium shadow-md"
            >
              + Add Source
            </button>
          </div>

          {loading ? (
            <div className="text-center mt-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F84C39] border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">Finding the best sources for your research...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <PromptSearchBar onSearch={handleQuerySearch} isLoading={isQuerying} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sources.length > 0 ? (
                  <>
                    {sources.map((src, i) =>
                      src.is_curated ? (
                        <CuratedSourceCard 
                          key={`curated-${i}`} 
                          source={src} 
                          onRemove={() => {}}
                          onAdd={() => handleAddToLibrary(src.id)} 
                        />
                      ) : (
                        <SourceCard key={`auto-${i}`} source={src} />
                      )
                    )}
                  </>
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-gray-500">
                      No sources found. Try adjusting your benchmark parameters or adding sources manually.
                    </p>
                  </div>
                )}
              </div>
              <div ref={bottomRef} />
            </>
          )}
        </div>
        
        {/* Add URL Modal */}
        <AddUrlModal 
          isOpen={isAddUrlModalOpen}
          onClose={() => setIsAddUrlModalOpen(false)}
          onAddSource={handleAddCuratedSource}
        />
      </div>
    </>
    );
};

export default SourceRoundupPage;