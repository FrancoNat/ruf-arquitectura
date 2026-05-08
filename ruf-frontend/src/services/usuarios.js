import { apiFetch } from "./api";

export async function getUsuarios() {
  return apiFetch("/api/admin/usuarios");
}

export async function createUsuario(data) {
  return apiFetch("/api/admin/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizeUsuarioPayload(data, true)),
  });
}

export async function updateUsuario(id, data) {
  return apiFetch(`/api/admin/usuarios/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizeUsuarioPayload(data, false)),
  });
}

export async function deleteUsuario(id) {
  return apiFetch(`/api/admin/usuarios/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

function normalizeUsuarioPayload(data, includePassword) {
  const payload = {
    nombre: data.nombre,
    email: data.email,
    rol: data.rol,
    activo: data.activo,
  };

  if (includePassword || data.password) {
    payload.password = data.password;
  }

  return payload;
}
