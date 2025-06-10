//frontend api client for calling backend endpoints using fetch()

export const API = import.meta.env.VITE_API_URL || "http://localhost:8000"; // fallback for dev

console.log("API URL:", API);

export async function fetchProjects() {
  const res = await fetch(`${API}/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  const data = await res.json();
  return data.projects;
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

export async function generatePrompt(projectId: string) {
  const res = await fetch(`${API}/generate_prompt?project_id=${projectId}`);
  if (!res.ok) throw new Error("Failed to generate prompt");
  return res.json();
}

export async function findSources(prompt: string) {
  const res = await fetch(`${API}/find_sources?search_prompt=${encodeURIComponent(prompt)}`);
  if (!res.ok) throw new Error("Failed to find sources");
}

export async function createResearchSpace(projectId: string, query: string, searchType: string) {
  const response = await fetch(`${API}/project/${projectId}/spaces`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, search_type: searchType }),
  });

  if (!response.ok) {
    throw new Error("Failed to create research space");
  }

  return await response.json();
}


export async function fetchResearchSpaces(projectId: string) {
  const res = await fetch(`${API}/project/${projectId}/spaces`);
  if (!res.ok) throw new Error("Failed to fetch research spaces");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchResearchSpaceById(projectId: string, spaceId: string) {
  const res = await fetch(`${API}/project/${projectId}/spaces/${spaceId}`);
  if (!res.ok) throw new Error("Failed to fetch research space");
  return await res.json();
}

export async function postSourcesToSpace(spaceId: string) {
  const res = await fetch(`${API}/space/${spaceId}/find_sources`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to find and save sources");
  return res.json(); // { sources }
}

export async function fetchSourcesForSpace(spaceId: string, projectId: string) {
  const res = await fetch(`${API}/space/${spaceId}/sources?project_id=${projectId}`);
  if (!res.ok) throw new Error("Failed to fetch sources");
  return await res.json();
}

export async function addSourceToProject(spaceId: string, projectId: string, sourceId: string) {
  const res = await fetch(`${API}/space/${spaceId}/add_source_to_project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_id: projectId, source_id: sourceId }),
  });
  return res.json();
}

export async function deleteResearchSpace(projectId: string, spaceId: string) {
  const res = await fetch(`${API}/project/${projectId}/spaces/${spaceId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete research space");
}

export async function checkHasProjectSources(projectId: string, spaceId: string) {
  const res = await fetch(`${API}/project/${projectId}/spaces/${spaceId}/has_project_sources`);
  if (!res.ok) throw new Error("Failed to fetch linked sources");
  return await res.json(); 
}










