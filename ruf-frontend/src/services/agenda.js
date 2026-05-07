import { apiFetch } from "./api";

function normalizarHora(hora) {
  return hora.length >= 5 ? hora.slice(0, 5) : hora;
}

function horaParaApi(hora) {
  return hora.length === 5 ? `${hora}:00` : hora;
}

function mapReunion(reunion) {
  return {
    ...reunion,
    hora: normalizarHora(reunion.hora),
  };
}

function mapBloqueo(bloqueo) {
  return {
    ...bloqueo,
    hora: normalizarHora(bloqueo.hora),
  };
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

export async function getHorariosBase() {
  const horarios = await apiFetch("/api/agenda/horarios-base");
  return horarios.map(normalizarHora);
}

export async function getAdminReuniones() {
  const reuniones = await apiFetch("/api/agenda/reuniones");
  return reuniones.map(mapReunion);
}

export async function updateEstadoReunion(id, estado) {
  const reunion = await apiFetch(
    `/api/agenda/reuniones/${encodeURIComponent(id)}/estado`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado }),
    }
  );

  return mapReunion(reunion);
}

export async function deleteReunion(id) {
  return apiFetch(`/api/agenda/reuniones/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getAdminBloqueos() {
  const bloqueos = await apiFetch("/api/agenda/bloqueos");
  return bloqueos.map(mapBloqueo);
}

export async function createBloqueo(data) {
  const bloqueo = await apiFetch("/api/agenda/bloqueos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fecha: data.fecha,
      hora: horaParaApi(data.hora),
      motivo: data.motivo,
    }),
  });

  return mapBloqueo(bloqueo);
}

export async function deleteBloqueo(id) {
  return apiFetch(`/api/agenda/bloqueos/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
