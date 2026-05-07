import { apiFetch } from "./api";

const fotosFallback = {
  "maria-g": "/images/testimonios/maria-g.jpg",
  "juan-p": "/images/testimonios/juan-p.avif",
  "lucas-r": "/images/testimonios/lucas-r.jpg",
};

function mapTestimonio(testimonio) {
  return {
    ...testimonio,
    tipo: testimonio.tipoProyecto,
    foto: fotosFallback[testimonio.id] || testimonio.foto,
  };
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

export async function createTestimonio(data) {
  return apiFetch("/api/testimonios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizeTestimonioPayload(data)),
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
