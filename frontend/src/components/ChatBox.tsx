import { useState } from 'react';
import { ChatMessage, ChatTurn, ChatBoxProps } from '../types';
import { chatWithSources } from '../api';
import { ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useEffect } from 'react';

export default function ChatBox({ projectId, spaceIds, isDisabled }: ChatBoxProps) {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    const userMessage: ChatMessage = { role: 'user', content: input };
    setInput('');
    setLoading(true);
  
    try {
      const data = await chatWithSources(projectId, input, spaceIds);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer,
      };
  
      const newTurn: ChatTurn = {
        userMessage,
        assistantMessage
      };
  
      setChatHistory((prev) => [...prev, newTurn]);
    } catch (error) {
      console.error('Error during chat:', error);
  
      setChatHistory((prev) => [
        ...prev,
        {
          userMessage,
          assistantMessage: {
            role: 'assistant',
            content: '⚠️ Something went wrong while fetching the response.',
          },
        },
      ]);
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

  return (
    <div className="flex flex-col h-full border border-[#E0D8CF] rounded-lg p-4 bg-[#FAF9F5]">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-[#8D7253] scrollbar-track-transparent pr-1">
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
