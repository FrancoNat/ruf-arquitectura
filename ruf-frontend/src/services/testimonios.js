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
