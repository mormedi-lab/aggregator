const API = import.meta.env.VITE_API_URL;

export async function fetchProjects() {
  const res = await fetch(`${API}/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function createProject(project: {
  title: string;
  industry: string;
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

export async function deleteProject(title: string) {
  const res = await fetch(`${API}/projects?title=${encodeURIComponent(title)}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete project");
  return res.json();
}

