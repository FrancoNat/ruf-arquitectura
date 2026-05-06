"use client";

import HorarioSlotAdmin from "./HorarioSlotAdmin";
import ReunionAdminCard from "./ReunionAdminCard";

function formatDateLabel(date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function DayDetailPanel({
  selectedDate,
  reuniones,
  bloqueos,
  horariosBase,
  horariosDisponibles,
  onConfirmarReunion,
  onCancelarReunion,
  onEliminarReunion,
  onBloquearHorario,
  onLiberarHorario,
}) {
  const ocupadosPorReunion = reuniones
    .filter((reunion) => reunion.estado === "pendiente" || reunion.estado === "confirmada")
    .map((reunion) => reunion.hora);

  const horariosBloqueados = bloqueos.map((bloqueo) => bloqueo.hora);

  return (
    <section className="space-y-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary/60">
          detalle del día
        </p>
        <h2 className="mt-2 text-2xl font-light text-primary">
          {formatDateLabel(selectedDate)}
        </h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm uppercase tracking-[0.16em] text-primary/60">
              reuniones
            </h3>

            <div className="mt-3 space-y-3">
              {reuniones.length === 0 ? (
                <div className="rounded-xl bg-background px-4 py-5 text-sm text-text/60">
                  no hay reuniones cargadas para este día.
                </div>
              ) : null}

              {reuniones.map((reunion) => (
                <ReunionAdminCard
                  key={reunion.id}
                  reunion={reunion}
                  onConfirmar={onConfirmarReunion}
                  onCancelar={onCancelarReunion}
                  onEliminar={onEliminarReunion}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm uppercase tracking-[0.16em] text-primary/60">
              horarios disponibles
            </h3>

            <div className="mt-3 space-y-3">
              {horariosDisponibles.length === 0 ? (
                <div className="rounded-xl bg-background px-4 py-5 text-sm text-text/60">
                  no quedan horarios disponibles.
                </div>
              ) : null}

              {horariosDisponibles.map((hora) => (
                <HorarioSlotAdmin
                  key={hora}
                  hora={hora}
                  tipo="disponible"
                  subtitulo="libre para reservar"
                  actionLabel="bloquear"
                  onAction={() => onBloquearHorario(hora)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.16em] text-primary/60">
              horarios ocupados
            </h3>

            <div className="mt-3 space-y-3">
              {reuniones
                .filter(
                  (reunion) =>
                    reunion.estado === "pendiente" || reunion.estado === "confirmada"
                )
                .map((reunion) => (
                  <HorarioSlotAdmin
                    key={`${reunion.id}-${reunion.hora}`}
                    hora={reunion.hora}
                    tipo="ocupado"
                    subtitulo={`${reunion.nombre} · ${reunion.estado}`}
                  />
                ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.16em] text-primary/60">
              horarios bloqueados
            </h3>

            <div className="mt-3 space-y-3">
              {bloqueos.length === 0 ? (
                <div className="rounded-xl bg-background px-4 py-5 text-sm text-text/60">
                  no hay horarios bloqueados en esta fecha.
                </div>
              ) : null}

              {bloqueos.map((bloqueo) => (
                <HorarioSlotAdmin
                  key={bloqueo.id}
                  hora={bloqueo.hora}
                  tipo="bloqueado"
                  subtitulo={bloqueo.motivo}
                  actionLabel="liberar"
                  onAction={() => onLiberarHorario(bloqueo.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
