import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
    q9: '',
    q10: '',
    q11: '',
  }); 

  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-saliec">Project: {projectId}</h1>
      <div className="mt-8 space-y-6 max-w-3xl">
        {/* Question 1 */}
        <div>
            <label className="block text-sm font-saliec font-semibold mb-1">
            1. What is the main objective of this benchmark?
            </label>
            <textarea
            value={answers.q1}
            onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 font-saliec-light focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
            placeholder="E.g. Understand current innovation trends, Map competitive landscape..."
            />
        </div>

        {/* Question 2 */}
        <div>
            <label className="block text-sm font-saliec font-semibold mb-1">
            2. Is there a specific topic, object, or area you are investigating?
            </label>
            <textarea
            value={answers.q2}
            onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 font-saliec-light focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
            placeholder="E.g. connected experiences, circular business models..."
            />
        </div>

        {/* Question 3 */}
        <div>
        <label className="block text-sm font-saliec font-semibold mb-1">
            3. Are there any specific companies you want to investigate or compare?
        </label>
        <textarea
            value={answers.q3}
            onChange={(e) => setAnswers({ ...answers, q3: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 font-saliec-light focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
            placeholder='E.g. Tesla, Lufthansa, Apple — or "new entrants in fintech"'
        />
        </div>

        {/* Question 4 */}
        <div>
        <label className="block text-sm font-saliec font-semibold mb-1">
            4. What kind of insights are you hoping to get?
        </label>
        <textarea
            value={answers.q4}
            onChange={(e) => setAnswers({ ...answers, q4: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 font-saliec-light focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
            placeholder="E.g. strategic positioning, UX details, service model comparisons..."
        />
        </div>

        {/* Question 5 */}
        <div>
        <label className="block text-sm font-saliec font-semibold mb-1">
            5. Who is the benchmark for, and what do they care about?
        </label>
        <textarea
            value={answers.q5}
            onChange={(e) => setAnswers({ ...answers, q5: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 font-saliec-light focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
            placeholder="E.g. Our client is a legacy mobility provider interested in in-cabin revenue models..."
        />
        </div>

        {/* Question 6 */}
        <div>
        <label className="block text-sm font-saliec font-semibold mb-1">
            6. What industry or sector(s) are most relevant to this benchmark?
        </label>
        <textarea
            value={answers.q6}
            onChange={(e) => setAnswers({ ...answers, q6: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 font-saliec-light focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
            placeholder='E.g. "mobility" or "business class airline cabins"'
        />
        </div>

        {/* Question 7 */}
        <div>
        <label className="block text-sm font-saliec font-semibold mb-1">
            7. What’s the desired level of detail or abstraction?
        </label>
        <textarea
            value={answers.q7}
            onChange={(e) => setAnswers({ ...answers, q7: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 font-saliec-light focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
            placeholder="E.g. High-level strategy vs. UX feature-level details vs. ecosystem architecture..."
        />
        </div>

        {/* Question 8 */}
        <div>
        <label className="block text-sm font-saliec font-semibold mb-1">
            8. Do you want to include or exclude any specific geographies or markets?
        </label>
        <textarea
            value={answers.q8}
            onChange={(e) => setAnswers({ ...answers, q8: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 font-saliec-light focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
            placeholder="E.g. Only EU and Japan. Avoid US-based companies."
        />
        </div>

        {/* Question 9 */}
        <div>
        <label className="block text-sm font-saliec font-semibold mb-1">
            9. Are you looking for any specific time frame or recency?
        </label>
        <textarea
            value={answers.q9}
            onChange={(e) => setAnswers({ ...answers, q9: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 font-saliec-light focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
            placeholder="E.g. Trends from the past 2 years, recent launches, legacy models, future visions..."
        />
        </div>

        {/* Question 10 */}
        <div>
        <label className="block text-sm font-saliec font-semibold mb-1">
            10. What formats or types of sources are most helpful?
        </label>
        <textarea
            value={answers.q10}
            onChange={(e) => setAnswers({ ...answers, q10: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 font-saliec-light focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
            placeholder="E.g. Case studies, interviews, press releases, whitepapers, expert blogs, etc."
        />
        </div>

        {/* Question 11 */}
        <div>
        <label className="block text-sm font-saliec font-semibold mb-1">
            11. Is there anything you definitely want to avoid?
        </label>
        <textarea
            value={answers.q11}
            onChange={(e) => setAnswers({ ...answers, q11: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 font-saliec-light focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
            placeholder="E.g. PR-heavy content, AI-generated fluff, outdated info."
        />
        </div>
        </div>

        <button
            onClick={async () => {
                try {
                  // Step 1: Generate prompt
                  const promptResponse = await fetch("http://localhost:8000/generate_prompt", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(answers),
                  });
              
                  const promptData = await promptResponse.json();
                  const generatedPrompt = promptData.prompt;
              
                  // Step 2: Find sources using the prompt
                  const sourceResponse = await fetch("http://localhost:8000/find_sources", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ search_prompt: generatedPrompt }),
                  });
              
                  const sourceData = await sourceResponse.json();
              
                  // Step 3: Navigate to Source Roundup page with sources
                  navigate(`/projects/${projectId}/sources`, { state: { sources: sourceData.sources } });
                } catch (err) {
                  console.error("Error generating prompt and fetching sources:", err);
                }
            }}
            className="mt-8 bg-[#FF5500] text-white px-6 py-3 rounded-xl font-saliec hover:bg-[#e64a00] transition-all"
            >
            Generate Search Prompt
        </button>


    </div>
  );
};

export default ProjectDetailPage;
