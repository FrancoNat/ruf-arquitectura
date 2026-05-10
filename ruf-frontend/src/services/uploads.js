import { API_URL } from "./api";
import { getToken, logout } from "./auth";

export async function uploadImage(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/admin/uploads/image`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const error = new Error(`error upload: ${res.status}`);
    error.status = res.status;

    try {
      error.data = await res.json();
    } catch {
      error.data = null;
    }
    error.message =
      error.data?.error ||
      error.data?.detail ||
      error.data?.title ||
      `error upload: ${res.status}`;

    if (res.status === 401) {
      logout();
    }

    throw error;
  }

  return res.json();
}
