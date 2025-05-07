import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { generatePrompt, findSources, fetchProjectById } from "../api";
import SourceCard from "../components/SourceCard";
import CuratedSourceCard from "../components/CuratedSourceCard";
import AddUrlModal from "../components/AddUrlModal";

interface LocationState {
  loading?: boolean;
}

interface Source {
  headline: string;
  publisher: string;
  url: string;
  date_published: string;
  summary: string;
  isCurated?: boolean;
}

const SourceRoundupPage = () => {
  const { id: projectId } = useParams();
  const location = useLocation();
  const locationState = location.state as LocationState;
  
  const [sources, setSources] = useState<Source[]>([]);
  const [curatedSources, setCuratedSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(locationState?.loading ?? true);
  const [error, setError] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [isAddUrlModalOpen, setIsAddUrlModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // First fetch the project to get its title
        const projectData = await fetchProjectById(projectId!);
        setProjectTitle(projectData.title);
        
        // Then get the generated prompt
        const promptRes = await generatePrompt(projectId!);
        
        // Then find sources based on that prompt
        const sourcesRes = await findSources(promptRes.prompt);
        setSources(sourcesRes.sources || []);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while finding sources.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  // Function to handle adding a curated source from URL
  const handleAddCuratedSource = async (url: string) => {
    try {
      // For demo purposes, we extract some basic information from the URL
      // In a real implementation, you'd have an API call to fetch metadata
      
      // Extract domain as publisher
      const urlObj = new URL(url);
      const publisher = urlObj.hostname.replace('www.', '');
      
      // Extract the last part of the path as a simple title
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);
      const headline = pathSegments.length > 0 
        ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ') 
        : 'Article';
        
      // Use today's date
      const today = new Date().toISOString().split('T')[0];
      
      const newSource: Source = {
        headline: headline.charAt(0).toUpperCase() + headline.slice(1),
        publisher,
        url,
        date_published: today,
        summary: "Manually curated source. Click to view the content.",
        isCurated: true
      };
      
      setCuratedSources(prev => [...prev, newSource]);
      return newSource;
    } catch (error) {
      console.error("Error adding curated source:", error);
      throw new Error("Failed to add source");
    }
  };
  
  // Function to remove a curated source
  const handleRemoveCuratedSource = (index: number) => {
    setCuratedSources(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-semibold text-[#0F1122]">
            {projectTitle ? `Sources for ${projectTitle}` : 'Research Sources'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sources.length > 0 || curatedSources.length > 0 ? (
                <>
                  {sources.map((src, i) => (
                    <SourceCard key={`auto-${i}`} source={src} />
                  ))}
                  
                  {curatedSources.map((src, i) => (
                    <CuratedSourceCard 
                      key={`curated-${i}`} 
                      source={src} 
                      onRemove={() => handleRemoveCuratedSource(i)} 
                    />
                  ))}
                </>
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">No sources found. Try adjusting your benchmark parameters or adding sources manually.</p>
                </div>
              )}
            </div>
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
  );
};

export default SourceRoundupPage;