import { apiFetch } from "./api";
import { getCategoriaNombre } from "@/utils/categorias";

export const proyectoIncluyeDefault = [
  {
    titulo: "reunión inicial",
    descripcion:
      "analizamos tu baño actual, puntos a mejorar y el estilo buscado. Para esta instancia vamos a pedirte previamente fotos del espacio y sus medidas.",
    items: [],
  },
  {
    titulo: "segunda reunión: propuesta de diseño en 3D",
    descripcion:
      "te presentamos una primera propuesta de cómo quedará tu baño. La revisamos juntos y ajustamos, modificamos o repensamos lo necesario para que el proyecto se ajuste a lo que buscás y necesitás.",
    items: [],
  },
  {
    titulo: "entrega final",
    descripcion: "recibís la carpeta completa del proyecto con:",
    items: [
      "renders finales",
      "planos 2D del espacio",
      "lista de compras de materiales y productos sugeridos",
      "detalles técnicos si hay muebles a medida",
    ],
  },
];

function normalizeIncluye(incluye) {
  const items = Array.isArray(incluye) && incluye.length > 0
    ? incluye
    : proyectoIncluyeDefault;

  return items.map((item) => ({
    titulo: item.titulo || "",
    descripcion: item.descripcion || "",
    items: Array.isArray(item.items) ? item.items : [],
  }));
}

function mapProyecto(proyecto) {
  return {
    ...proyecto,
    imagen: proyecto.imagenPrincipal,
    alt: `${proyecto.titulo} desarrollado por rüf arquitectura`,
    descripcion: proyecto.descripcionLarga || proyecto.descripcionCorta,
    imagenes: proyecto.imagenes?.length
      ? proyecto.imagenes
      : [proyecto.imagenPrincipal].filter(Boolean),
    incluye: normalizeIncluye(proyecto.incluye),
    categoriaNombre: getCategoriaNombre(proyecto.categoria),
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
    incluye: normalizeIncluye(data.incluye),
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
