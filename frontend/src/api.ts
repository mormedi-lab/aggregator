//frontend api client for calling backend endpoints using fetch()

export const API = import.meta.env.VITE_API_URL || "http://localhost:8000"; // fallback for dev

console.log("API URL:", API);

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
  const res = await fetch(`${API}/project?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete project");
  return res.json();
}

export async function fetchProjectById(id: string) {
  const res = await fetch(`${API}/project?id=${id}`);
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
}


export async function updateProject(project: {
  id: string;
  title: string;
  industry: string;
  objective: string;
}) {
  const res = await fetch("${API}/project", {
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


export async function generatePrompt(projectId: string) {
  const res = await fetch(`${API}/generate_prompt?project_id=${projectId}`);
  if (!res.ok) throw new Error("Failed to generate prompt");
  return res.json();
}

export async function findSources(prompt: string) {
  const res = await fetch(`${API}/find_sources?search_prompt=${encodeURIComponent(prompt)}`);
  if (!res.ok) throw new Error("Failed to find sources");
export async function postAndSaveSources(projectId: string, prompt: string) {
  const res = await fetch(`${API}/find_sources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_id: projectId,
      search_prompt: prompt,
    }),
  });

  if (!res.ok) throw new Error("Failed to save sources");
  return res.json(); // returns { sources }
}

export async function getSavedSources(projectId: string) {
  const res = await fetch(`${API}/projects/${projectId}/sources`);
  if (!res.ok) throw new Error("Failed to fetch saved sources");
  return res.json();
}

export async function addSourceToLibrary(projectId: string, sourceId: string) {
  const res = await fetch(`${API}/project/${projectId}/library/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ source_id: sourceId })
  });

  if (!res.ok) throw new Error("Failed to add source to library");
  return res.json();
}

export async function getProjectLibrary(projectId: string) {
  const res = await fetch(`${API}/project/${projectId}/library`);
  if (!res.ok) throw new Error("Failed to load library");
  return res.json();
}

export async function removeSourceFromLibrary(projectId: string, sourceId: string) {
  const res = await fetch(`${API}/project/${projectId}/library/remove`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ source_id: sourceId })
  });

  if (!res.ok) throw new Error("Failed to remove source from library");
  return res.json();
}

export async function fetchMetadataFromUrl(url: string) {
  const res = await fetch(`${API}/metadata?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("Failed to fetch metadata");
  return res.json();
}







