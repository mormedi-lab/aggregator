import { useState } from 'react';
import { ChatMessage, ChatTurn, ChatBoxProps } from '../types';
import { chatWithSources } from '../api';
import { ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useEffect, useRef } from 'react';

export default function ChatBox({ projectId, spaceIds, isDisabled }: ChatBoxProps) {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    const userMessage: ChatMessage = { role: 'user', content: input };
    const newTurn: ChatTurn = { userMessage, assistantMessage: { role: 'assistant', content: '' } };
    setChatHistory((prev) => [...prev, newTurn]);
    setInput('');
    setLoading(true);
  
    try {
      const data = await chatWithSources(projectId, input, spaceIds);
  
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].assistantMessage = { role: 'assistant', content: data.answer };
        return updated;
      });
    } catch (error) {
      console.error('Error during chat:', error);
  
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].assistantMessage = {
          role: 'assistant',
          content: '⚠️ Something went wrong while fetching the response.',
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };    

  function ThinkingAnimation() {
    const [dots, setDots] = useState('');
  
    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
      }, 400);
      return () => clearInterval(interval);
    }, []);
  
    return <div className="text-sm text-neutral-500 font-medium">Thinking{dots}</div>;
  }

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="flex flex-col h-full border border-[#E0D8CF] rounded-lg p-4 bg-[#FAF9F5]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-[#8D7253] scrollbar-track-transparent pr-1">
        {chatHistory.map((turn, index) => (
          <div key={index} className="space-y-2">
            <div className="text-right">
              <div className="bg-orange-100 p-2 rounded-lg inline-block max-w-[80%] text-sm">
                {turn.userMessage.content}
              </div>
            </div>
            <div className="text-left">
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                <ReactMarkdown className="prose prose-sm max-w-none leading-snug [&_p]:my-2 [&_strong]:font-semibold">
                  {turn.assistantMessage.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && <ThinkingAnimation />}
      </div>

      <div className="mt-auto w-full">
        <div className="relative">
          <form onSubmit={handleSubmit} className="relative w-full">
            <input
              type="text"
              disabled={isDisabled || loading}
              placeholder={
                isDisabled
                  ? 'Select a research space with sources to start chatting'
                  : 'Ask a question about the selected sources…'
              }
              className={`w-full pr-12 pl-4 py-3 rounded-xl border border-[#D8CDBF] bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#8D7253] ${
                isDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
              }`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={isDisabled || loading}
              className="absolute bottom-2 right-2 bg-[#FF5400] hover:bg-[#e94c00] text-white p-2 rounded-full shadow-md disabled:opacity-50"
            >
              <ArrowUp size={16} />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
