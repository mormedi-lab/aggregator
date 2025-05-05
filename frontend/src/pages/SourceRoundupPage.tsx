import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { generatePrompt, findSources } from "../api";

const SourceRoundupPage = () => {
  const { id: projectId } = useParams();
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSources = async () => {
      try {
        setLoading(true);
        const promptRes = await generatePrompt(projectId!);
        const sourcesRes = await findSources(promptRes.prompt);
        setSources(sourcesRes.sources || []);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while finding sources.");
      } finally {
        setLoading(false);
      }
    };

    loadSources();
  }, [projectId]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Source Roundup</h1>

      {loading ? (
        <div className="text-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-600">Finding sources, please wait...</p>
        </div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : sources.length === 0 ? (
        <div className="text-gray-600">No sources found.</div>
      ) : (
        <div className="grid gap-4">
          {sources.map((url, idx) => (
            <div
              key={idx}
              className="border border-gray-200 p-4 rounded shadow-sm hover:shadow transition"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {url}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SourceRoundupPage;
