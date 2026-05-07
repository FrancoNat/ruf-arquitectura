"use client";

export default function HorariosDisponibles({
  fecha,
  horariosDisponibles,
  horaSeleccionada,
  cargando,
  error,
  onSeleccionarHora,
}) {
  if (!fecha) {
    return (
      <div className="rounded-xl border border-dashed border-black/10 bg-background px-4 py-6 text-sm text-text/60">
        seleccioná una fecha para ver horarios disponibles
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="rounded-xl border border-dashed border-black/10 bg-background px-4 py-6 text-sm text-text/60">
        cargando horarios...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-dashed border-black/10 bg-background px-4 py-6 text-sm text-text/60">
        no pudimos cargar los horarios
      </div>
    );
  }

  if (horariosDisponibles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/10 bg-background px-4 py-6 text-sm text-text/60">
        no hay horarios disponibles para este día
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {horariosDisponibles.map((hora) => (
        <button
          key={hora}
          type="button"
          onClick={() => onSeleccionarHora(hora)}
          className={`rounded-lg border p-2.5 text-sm transition ${
            horaSeleccionada === hora
              ? "border-primary bg-primary text-white"
              : "border-black/10 bg-white text-text hover:bg-background"
          }`}
        >
          {hora}
        </button>
      ))}
    </div>
  );
}
