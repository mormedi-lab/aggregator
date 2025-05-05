import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { generatePrompt, findSources } from "../api";
import SourceCard from "../components/SourceCard";

interface Source {
  headline: string;
  publisher: string;
  url: string;
  date_published: string;
  summary: string;
}

const SourceRoundupPage = () => {
  const { id: projectId } = useParams();
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSources = async () => {
      try {
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
      <h1 className="text-2xl font-semibold mb-6">Sources for project {projectId}</h1>

      {loading ? (
        <div className="text-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-600">Finding sources, please wait...</p>
        </div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sources.map((src, i) => (
            <SourceCard key={i} source={src} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SourceRoundupPage;
