const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const TOKEN_KEY = "ruf-admin-token";
const USER_KEY = "ruf-admin-user";

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = new Error(`error auth: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  const data = await res.json();
  guardarSesion(data.token, data.usuario);
  return data;
}

export function logout() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getToken() {
  if (typeof window === "undefined") return null;

  return window.localStorage.getItem(TOKEN_KEY);
}

export function getUsuarioActual() {
  if (typeof window === "undefined") return null;

  const usuario = window.localStorage.getItem(USER_KEY);
  if (!usuario) return null;

  try {
    return JSON.parse(usuario);
  } catch {
    logout();
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}

function guardarSesion(token, usuario) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(usuario));
}
