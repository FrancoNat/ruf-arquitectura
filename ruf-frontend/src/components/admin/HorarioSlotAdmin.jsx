"use client";

const stylesByType = {
  disponible: "bg-white text-text border-black/10 hover:border-primary hover:text-primary",
  ocupado: "bg-amber-50 text-amber-700 border-amber-200",
  bloqueado: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function HorarioSlotAdmin({
  hora,
  tipo,
  subtitulo,
  actionLabel,
  onAction,
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${stylesByType[tipo]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{hora}</p>
          {subtitulo ? (
            <p className="mt-1 text-xs opacity-80">{subtitulo}</p>
          ) : null}
        </div>

        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="rounded-lg bg-primary px-3 py-2 text-xs text-white transition hover:opacity-85"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
