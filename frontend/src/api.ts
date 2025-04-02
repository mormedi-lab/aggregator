import { Project } from './types';

const API_URL = "http://localhost:8000";

export const fetchProjects = async (): Promise<Project[]> => {
    const res = await fetch('http://localhost:8000/projects');
    const data = await res.json();
    console.log('Fetched projects:', data); // 👈 log this
    return data;
  };
  

export async function createProject(name: string, description?: string): Promise<Project> {
  const res = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description }),
  });

  if (!res.ok) throw new Error("Failed to create project");

  return {
    name,
    description,
    lastAccessed: new Date().toISOString().split("T")[0],
  };
}
