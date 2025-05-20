import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface PromptSearchBarProps {
  onSearch: (query: string, model: string) => void;
  isLoading?: boolean;
}

const models = ["ChatGPT o1", "Perplexity", "Sonnet 3.7"];

export default function PromptSearchBar({ onSearch, isLoading = false }: PromptSearchBarProps) {
  const [query, setQuery] = useState("");
  const [model, setModel] = useState(models[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, model);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [query]);

  return (
    <div className="w-full rounded-xl border border-gray-200 shadow-md bg-white mb-6 focus-within:ring-2 focus-within:ring-[#191B44] transition">
      <div className="flex flex-col justify-between p-4 min-h-[120px]">
        {/* Growing Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Search for additional sources..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full resize-none overflow-hidden border-none focus:ring-0 focus:outline-none text-sm placeholder-gray-500"
        />
  
        {/* Bottom controls (selector + button) */}
        <div className="flex items-end justify-between mt-3">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="text-sm text-gray-500 bg-transparent focus:outline-none cursor-pointer"
          >
            {models.map((m) => (
              <option key={m} value={m} className="text-black text-sm">
                {m}
              </option>
            ))}
          </select>
          <button
            className="rounded-full bg-[#191B44] text-white p-2 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSearch}
            disabled={isLoading}
            >
            {isLoading ? (
                <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                />
                </svg>
            ) : (
                <ArrowUp className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};