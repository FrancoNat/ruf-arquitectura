const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch(path) {
  const res = await fetch(`${API_URL}${path}`);

  if (!res.ok) {
    throw new Error(`error api: ${res.status}`);
  }

  return res.json();
}
