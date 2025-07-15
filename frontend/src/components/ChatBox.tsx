import { useState } from 'react';
import { ChatMessage, ChatTurn, ChatBoxProps } from '../types';
import { chatWithSources } from '../api';

export default function ChatBox({ projectId, spaceId, isDisabled }: ChatBoxProps) {
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
      const data = await chatWithSources(spaceId, projectId, userMessage.content);
  
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer,
      };
  
      const newTurn: ChatTurn = {
        userMessage,
        assistantMessage,
        citations: data.citations,
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
          citations: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="flex flex-col flex-grow h-full border rounded-lg p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {chatHistory.map((turn, index) => (
          <div key={index} className="space-y-2">
            <div className="text-right">
              <div className="bg-orange-100 p-2 rounded-lg inline-block max-w-[80%]">
                {turn.userMessage.content}
              </div>
            </div>
            <div className="text-left">
              <div className="bg-gray-100 p-2 rounded-lg inline-block max-w-[80%]">
                {turn.assistantMessage.content}
              </div>
              {turn.citations.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Sources: {turn.citations.map((c, i) => <span key={i}>[{c}] </span>)}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-muted-foreground">Thinking…</div>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          disabled={isDisabled || loading}
          placeholder={
            isDisabled
              ? 'Select a research space with sources to start chatting'
              : 'Ask a question about the selected sources…'
          }
          className={`flex-1 border rounded px-3 py-2 ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={isDisabled || loading}
          className="bg-orange-500 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
