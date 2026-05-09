"use client";

import ReunionAdminCard from "./ReunionAdminCard";

function formatDateLabel(fecha) {
  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
}

export default function PendingReunionesList({
  reuniones,
  onSelectFecha,
  onConfirmarReunion,
  onCancelarReunion,
  onEliminarReunion,
}) {
  return (
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary/60">
            pendientes
          </p>
          <h2 className="mt-2 text-2xl font-light text-primary">
            reuniones pendientes
          </h2>
        </div>

        <p className="text-sm text-text/60">
          {reuniones.length} por revisar
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {reuniones.length === 0 ? (
          <div className="rounded-xl bg-background px-4 py-5 text-sm text-text/60">
            no hay reuniones pendientes.
          </div>
        ) : null}

        {reuniones.map((reunion) => (
          <div key={reunion.id} className="space-y-2">
            <div className="flex flex-col gap-2 rounded-xl bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-text/70">
                fecha: {formatDateLabel(reunion.fecha)}
              </p>

              <button
                type="button"
                onClick={() => onSelectFecha(reunion.fecha)}
                className="w-fit rounded-lg border border-primary/20 px-3 py-2 text-xs text-primary transition hover:bg-white"
              >
                ver día
              </button>
            </div>

            <ReunionAdminCard
              reunion={reunion}
              onConfirmar={onConfirmarReunion}
              onCancelar={onCancelarReunion}
              onEliminar={onEliminarReunion}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
