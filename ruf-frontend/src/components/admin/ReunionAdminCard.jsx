"use client";

const badgeStyles = {
  pendiente: "bg-amber-100 text-amber-700",
  confirmada: "bg-emerald-100 text-emerald-700",
  cancelada: "bg-rose-100 text-rose-700",
};

export default function ReunionAdminCard({
  reunion,
  onConfirmar,
  onCancelar,
  onEliminar,
}) {
  return (
    <article className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base text-primary">{reunion.nombre}</p>
          <p className="mt-1 text-sm text-text/70">
            {reunion.tipoProyectoNombre || reunion.tipoProyecto}
          </p>
          <p className="mt-2 text-sm text-text/55">hora: {reunion.hora}</p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs ${badgeStyles[reunion.estado]}`}
        >
          {reunion.estado}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onConfirmar(reunion.id)}
          className="rounded-lg bg-primary px-3 py-2 text-xs text-white transition hover:opacity-85"
        >
          confirmar
        </button>

        <button
          type="button"
          onClick={() => onCancelar(reunion.id)}
          className="rounded-lg border border-primary/20 px-3 py-2 text-xs text-primary transition hover:bg-background"
        >
          cancelar
        </button>

        <button
          type="button"
          onClick={() => onEliminar(reunion.id)}
          className="rounded-lg border border-primary/20 px-3 py-2 text-xs text-primary transition hover:bg-background"
        >
          eliminar
        </button>
      </div>
    </article>
  );
}
