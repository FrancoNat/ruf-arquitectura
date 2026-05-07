export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch(path, options) {
  const res = await fetch(`${API_URL}${path}`, options);

  if (!res.ok) {
    throw new Error(`error api: ${res.status}`);
  }

  return res.json();
}
