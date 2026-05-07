export const ADMIN_CATEGORIAS_STORAGE_KEY = "ruf-admin-categorias";

export const adminCategoriasIniciales = [
  { id: "casa", nombre: "casa" },
  { id: "interior", nombre: "interior" },
  { id: "mueble", nombre: "mueble" },
];

export function normalizarCategoria(valor) {
  return valor
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
