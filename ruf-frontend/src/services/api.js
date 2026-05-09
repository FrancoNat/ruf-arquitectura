import { getToken, logout } from "./auth";
import { API_URL } from "@/config/api";

export { API_URL };

export async function apiFetch(path, options) {
  const token = getToken();
  const headers = {
    ...(options?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = new Error(`error api: ${res.status}`);
    error.status = res.status;

    try {
      error.data = await res.json();
    } catch {
      error.data = null;
    }

    if (res.status === 401 || res.status === 403) {
      error.message =
        res.status === 401
          ? "sesión vencida o no iniciada"
          : "no tenés permisos para esta acción";

      if (res.status === 401) {
        logout();
      }
    }

    throw error;
  }

  if (res.status === 204) {
    return null;
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
