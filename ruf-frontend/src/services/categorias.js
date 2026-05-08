import { apiFetch } from "./api";

function mapCategoria(categoria) {
  return {
    ...categoria,
    id: categoria.id,
    nombre: categoria.nombre,
  };
}

function mapCategorias(categorias) {
  return categorias.map(mapCategoria);
}

export async function getCategorias() {
  const categorias = await apiFetch("/api/categorias");
  return mapCategorias(categorias);
}

export async function createCategoria(data) {
  return apiFetch("/api/categorias", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: data.id,
      nombre: data.nombre,
    }),
  });
}

export async function updateCategoria(id, data) {
  return apiFetch(`/api/categorias/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: data.nombre,
    }),
  });
}

export async function deleteCategoria(id) {
  return apiFetch(`/api/categorias/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
