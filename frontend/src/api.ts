const API_BASE = import.meta.env.VITE_API_URL;

export async function pingBackend() {
  const res = await fetch(`${API_BASE}/`);
  if (!res.ok) throw new Error("Failed to reach backend");
  return res.json();
}


