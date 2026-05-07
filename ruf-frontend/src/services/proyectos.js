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
