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
  return res.json();
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
