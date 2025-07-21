import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResearchSpaceLoadingPage() {
  const { id: projectId, spaceId } = useParams<{ id: string; spaceId: string }>();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const runPipeline = async () => {
      const DELAY_MS = 1500;
      const MAX_RETRIES = 20;

      await new Promise((r) => setTimeout(r, 1000)); 

      if (!API) {
        throw new Error("❌ VITE_API_BASE_URL is not defined");
      }

      try {
        // 1. Generate prompt
        await fetch(`${API}/space/${spaceId}/generate_prompt`, {
          method: "POST",
        });

        // 2. Fetch sources from LLM
        await fetch(`${API}/space/${spaceId}/find_sources`, {
          method: "POST",
        });

        // 3. Poll until sources are ready
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          const res = await fetch(`${API}/space/${spaceId}/sources?project_id=${projectId}`);
          const data = await res.json();

          if (data.sources && data.sources.length > 0) {
            navigate(`/project/${projectId}/space/${spaceId}`);
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
        }

        console.warn("⚠️ Timed out waiting for sources.");
        navigate(`/project/${projectId}/space/${spaceId}`);
      } catch (err) {
        console.error("❌ Failed during research space loading flow", err);
      }
    };

    if (projectId && spaceId) {
      runPipeline();
    }
  }, [projectId, spaceId, navigate, API]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FAF9F5] text-[#2D2114] px-6">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#2D2114] border-opacity-50 mb-4"></div>
      <div className="text-xl font-medium mb-2">Creating your research space...</div>
      <div className="text-sm text-[#827F7F]">Generating prompt and finding relevant sources</div>
    </div>
  );
}
