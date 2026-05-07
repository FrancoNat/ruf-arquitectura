import { apiFetch } from "./api";

function mapProyecto(proyecto) {
  return {
    ...proyecto,
    imagen: proyecto.imagenPrincipal,
    alt: `${proyecto.titulo} desarrollado por rüf arquitectura`,
    descripcion: proyecto.descripcionLarga || proyecto.descripcionCorta,
    imagenes: proyecto.imagenes?.length
      ? proyecto.imagenes
      : [proyecto.imagenPrincipal].filter(Boolean),
  };
}

function mapProyectos(proyectos) {
  return proyectos.map(mapProyecto);
}

export async function getProyectos() {
  const proyectos = await apiFetch("/api/proyectos?estado=publicado");
  return mapProyectos(proyectos);
}

export async function getProyectoById(id) {
  const proyecto = await apiFetch(`/api/proyectos/${encodeURIComponent(id)}`);
  return mapProyecto(proyecto);
}

export async function getProyectosDestacados() {
  const proyectos = await apiFetch(
    "/api/proyectos?estado=publicado&destacado=true"
  );
  return mapProyectos(proyectos);
}

function normalizeProyectoPayload(data) {
  return {
    titulo: data.titulo,
    categoria: data.categoria,
    descripcionCorta: data.descripcionCorta,
    descripcionLarga: data.descripcionLarga,
    ubicacion: data.ubicacion,
    anio: data.anio,
    superficie: data.superficie,
    estado: data.estado,
    destacado: data.destacado,
    imagenPrincipal: data.imagenPrincipal,
    imagenes: Array.isArray(data.imagenes) ? data.imagenes : [],
  };
}

export async function getAdminProyectos() {
  const proyectos = await apiFetch("/api/proyectos");
  return mapProyectos(proyectos);
}

export async function getAdminProyectoById(id) {
  const proyecto = await apiFetch(`/api/proyectos/${encodeURIComponent(id)}`);
  return mapProyecto(proyecto);
}

export async function createProyecto(data) {
  return apiFetch("/api/proyectos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizeProyectoPayload(data)),
  });
}

export async function updateProyecto(id, data) {
  return apiFetch(`/api/proyectos/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizeProyectoPayload(data)),
  });
}

export async function deleteProyecto(id) {
  return apiFetch(`/api/proyectos/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
