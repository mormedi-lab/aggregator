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
  
    const data = await res.json(); // <- Get response with _id
  
    return {
      _id: data._id, // ✅ use the actual value from the backend
      name: data.name,
      description: data.description,
      lastAccessed: new Date().toISOString().split("T")[0],
    };
  }
  

export async function deleteProject(id: string) {
  const response = await fetch(`http://localhost:8000/api/projects/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }

  return await response.json();
}


