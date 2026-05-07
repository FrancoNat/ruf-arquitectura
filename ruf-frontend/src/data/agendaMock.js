export const horariosBase = [
  "10:00",
  "11:00",
  "12:00",
  "16:00",
  "17:00",
  "18:00",
];

export const reunionesMock = [
  {
    id: "1",
    nombre: "maría g.",
    tipoProyecto: "interiorismo",
    fecha: "2026-05-10",
    hora: "10:00",
    estado: "pendiente",
  },
  {
    id: "2",
    nombre: "lucas r.",
    tipoProyecto: "vivienda",
    fecha: "2026-05-10",
    hora: "16:00",
    estado: "confirmada",
  },
  {
    id: "3",
    nombre: "juan p.",
    tipoProyecto: "muebles a medida",
    fecha: "2026-05-12",
    hora: "17:00",
    estado: "pendiente",
  },
];

export const bloqueosMock = [
  {
    id: "b1",
    fecha: "2026-05-10",
    hora: "11:00",
    motivo: "ocupado por obra",
  },
  {
    id: "b2",
    fecha: "2026-05-12",
    hora: "12:00",
    motivo: "visita tecnica",
  },
];

export function getHorariosDisponibles(
  fecha,
  reuniones,
  bloqueos,
  horarios
) {
  if (!fecha) {
    return [];
  }

  const horariosOcupados = reuniones
    .filter(
      (reunion) =>
        reunion.fecha === fecha &&
        (reunion.estado === "pendiente" || reunion.estado === "confirmada")
    )
    .map((reunion) => reunion.hora);

  const horariosBloqueados = bloqueos
    .filter((bloqueo) => bloqueo.fecha === fecha)
    .map((bloqueo) => bloqueo.hora);

  return horarios.filter(
    (hora) =>
      !horariosOcupados.includes(hora) && !horariosBloqueados.includes(hora)
  );
}
