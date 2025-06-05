import { useState } from "react";
import { askSources } from "../api";
import { Source } from "../types";

interface ChatWithSourcesProps {
  selectedSources: Source[];
}

export default function ChatWithSources({ selectedSources }: ChatWithSourcesProps) {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!input.trim() || !selectedSources || selectedSources.length === 0) return;

    setLoading(true);
    setAnswer(null);
    setError(null);

    try {
      const res = await askSources(input, selectedSources);
      setAnswer(res.answer);
    } catch (err) {
      console.error("Error:", err);
      setError("❌ Failed to fetch answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border border-[#E0D8CF] bg-[#FAF9F5] rounded-md h-full flex flex-col">
      <div className="text-sm font-medium text-[#2D2114] mb-2">Ask your selected sources</div>
      
      <textarea
        className="w-full text-sm p-2 border border-[#E0D8CF] rounded mb-2 resize-none"
        rows={3}
        placeholder="Ask a question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleAsk}
        className="bg-[#FF5400] hover:bg-[#ff6a1a] text-white text-xs px-4 py-1 rounded self-start mb-2"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {error && <div className="mt-2 text-xs text-red-600">{error}</div>}

      {answer && (
        <div className="flex-1 overflow-y-auto mb-3 p-3 text-sm bg-white rounded border border-[#E0D8CF] whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
}
