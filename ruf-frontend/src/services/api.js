export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch(path, options) {
  const res = await fetch(`${API_URL}${path}`, options);

  if (!res.ok) {
    const error = new Error(`error api: ${res.status}`);
    error.status = res.status;

    try {
      error.data = await res.json();
    } catch {
      error.data = null;
    }

    throw error;
  }

  if (res.status === 204) {
    return null;
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
