const colaboradoresConPermisoEliminar = (
  process.env.NEXT_PUBLIC_DELETE_USERS_ALLOWED_NAMES || ""
)
  .split(",")
  .map(normalizarTexto)
  .filter(Boolean);

export function puedeGestionarColaboradores(usuario) {
  return usuario?.rol === "admin" || puedeEliminarUsuarios(usuario);
}

export function puedeCrearOEditarColaboradores(usuario) {
  return usuario?.rol === "admin";
}

export function puedeEliminarUsuarios(usuario) {
  if (usuario?.rol === "admin") {
    return true;
  }

  return colaboradoresConPermisoEliminar.includes(
    normalizarTexto(usuario?.nombre || "")
  );
}

function normalizarTexto(valor) {
  return valor
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
