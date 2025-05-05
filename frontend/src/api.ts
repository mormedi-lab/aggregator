//frontend api client for calling backend endpoints using fetch()

const API = import.meta.env.VITE_API_URL;

export async function fetchProjects() {
  const res = await fetch(`${API}/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function createProject(project: {
  title: string;
  industry: string;
  objective: string;
}) {
  const res = await fetch(`${API}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });

  if (!res.ok) throw new Error("Failed to create project");

  const data = await res.json();
  return data.id; // return just the ID
}

export async function deleteProject(id: string) {
  const res = await fetch(`http://localhost:8000/project?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete project");
  return res.json();
}

export async function fetchProjectById(id: string) {
  const res = await fetch(`http://localhost:8000/project?id=${id}`);
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
}


export async function updateProject(project: {
  id: string;
  title: string;
  industry: string;
  objective: string;
}) {
  const res = await fetch("http://localhost:8000/project", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
}

export async function saveBenchmark(data: {
  project_id: string;
  objective: string;
  companies: string;
  industries: string;
  geographies: string;
  timeframe: string;
  source_type: string;
}) {
  const res = await fetch(`${API}/benchmark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to save benchmark");
  return res.json();
}

export async function fetchBenchmark(projectId: string) {
  const res = await fetch(`${API}/benchmark?project_id=${projectId}`);
  if (!res.ok) throw new Error("Failed to fetch benchmark");
  return res.json();
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"; // fallback for dev

export async function generatePrompt(projectId: string) {
  const res = await fetch(`${BASE_URL}/generate_prompt?project_id=${projectId}`);
  if (!res.ok) throw new Error("Failed to generate prompt");
  return res.json();
}

export async function findSources(prompt: string) {
  const res = await fetch(`${BASE_URL}/find_sources?search_prompt=${encodeURIComponent(prompt)}`);
  if (!res.ok) throw new Error("Failed to find sources");
  return res.json();
}





