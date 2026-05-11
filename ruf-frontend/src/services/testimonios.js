import { apiFetch } from "./api";
import { getCategoriaNombre } from "@/utils/categorias";

const fotosFallback = {
  "maria-g": "/images/testimonios/maria-g.jpg",
  "juan-p": "/images/testimonios/juan-p.avif",
  "lucas-r": "/images/testimonios/lucas-r.jpg",
};

function mapTestimonio(testimonio) {
  const fotoFallback = fotosFallback[testimonio.id];
  const foto = fotoFallback || normalizeFoto(testimonio.foto);

  return {
    ...testimonio,
    tipo: getCategoriaNombre(testimonio.tipoProyecto),
    tipoProyectoNombre: getCategoriaNombre(testimonio.tipoProyecto),
    foto,
  };
}

function normalizeFoto(foto) {
  if (!foto || foto === "/images/logos/ruf-full-marron.png") {
    return "";
  }

  return foto;
}

export async function getTestimoniosHome() {
  const testimonios = await apiFetch(
    "/api/testimonios?estado=activo&mostrarEnHome=true"
  );

  return testimonios.map(mapTestimonio);
}

function normalizeTestimonioPayload(data) {
  return {
    nombre: data.nombre,
    tipoProyecto: data.tipoProyecto,
    texto: data.texto,
    estrellas: Number(data.estrellas),
    foto: data.foto,
    estado: data.estado,
    mostrarEnHome: data.mostrarEnHome,
  };
}

export async function getAdminTestimonios() {
  const testimonios = await apiFetch("/api/testimonios");
  return testimonios.map(mapTestimonio);
}

export async function getAdminTestimonioById(id) {
  const testimonio = await apiFetch(
    `/api/testimonios/${encodeURIComponent(id)}`
  );
  return mapTestimonio(testimonio);
}

export async function createPublicTestimonio(data) {
  const body = new FormData();
  body.append("nombre", data.nombre);
  body.append("tipoProyecto", data.tipoProyecto);
  body.append("texto", data.texto);
  body.append("estrellas", String(Number(data.estrellas)));

  if (data.foto) {
    body.append("foto", data.foto, data.foto.name || "testimonio.jpg");
  }

  return apiFetch("/api/testimonios/solicitudes", {
    method: "POST",
    body,
  });
}

export async function updateTestimonio(id, data) {
  return apiFetch(`/api/testimonios/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizeTestimonioPayload(data)),
  });
}

export async function deleteTestimonio(id) {
  return apiFetch(`/api/testimonios/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
