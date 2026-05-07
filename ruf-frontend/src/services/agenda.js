import { apiFetch } from "./api";

function normalizarHora(hora) {
  return hora.length >= 5 ? hora.slice(0, 5) : hora;
}

function horaParaApi(hora) {
  return hora.length === 5 ? `${hora}:00` : hora;
}

export async function getHorariosDisponibles(fecha) {
  const horarios = await apiFetch(
    `/api/agenda/horarios-disponibles?fecha=${encodeURIComponent(fecha)}`
  );

  return horarios.map(normalizarHora);
}

export async function crearReunion(data) {
  return apiFetch("/api/agenda/reuniones", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: data.nombre,
      tipoProyecto: data.tipoProyecto,
      fecha: data.fecha,
      hora: horaParaApi(data.hora),
    }),
  });
}
