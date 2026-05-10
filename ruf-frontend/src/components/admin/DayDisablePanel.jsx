"use client";

import { useEffect, useState } from "react";

export default function DayDisablePanel({
  selectionMode,
  selectedDates,
  saving,
  onToggleSelectionMode,
  onAddRange,
  onSave,
  onUnlock,
}) {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  useEffect(() => {
    if (!desde || !hasta) {
      return;
    }

    onAddRange(desde, hasta);
  }, [desde, hasta, onAddRange]);

  const guardarDesactivacion = async () => {
    const saved = await onSave();

    if (saved) {
      setDesde("");
      setHasta("");
    }
  };

  const desbloquearDias = async () => {
    const unlocked = await onUnlock();

    if (unlocked) {
      setDesde("");
      setHasta("");
    }
  };

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary/60">
            días no disponibles
          </p>
          <h2 className="mt-2 text-2xl font-light text-primary">
            desactivar días
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text/65">
            seleccioná días salteados en el calendario o cargá un rango. al guardar,
            se bloquean todos los horarios disponibles de esos días.
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleSelectionMode}
          className={`w-fit rounded-full px-4 py-2 text-sm transition sm:rounded-xl ${
            selectionMode
              ? "bg-primary text-white hover:opacity-85"
              : "border border-primary/20 text-primary hover:bg-background"
          }`}
        >
          {selectionMode ? "seleccionando días" : "seleccionar en calendario"}
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-text/75">
          <span>desde</span>
          <input
            type="date"
            value={desde}
            onChange={(event) => setDesde(event.target.value)}
            className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
          />
        </label>

        <label className="space-y-2 text-sm text-text/75">
          <span>hasta</span>
          <input
            type="date"
            value={hasta}
            onChange={(event) => setHasta(event.target.value)}
            className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
          />
        </label>

      </div>

      <div className="mt-5 rounded-xl border border-black/5 bg-background p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text/70">
            {selectedDates.length === 0
              ? "no hay días seleccionados"
              : `${selectedDates.length} día(s) seleccionado(s)`}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={guardarDesactivacion}
              disabled={selectedDates.length === 0 || saving}
              className="rounded-full bg-primary px-4 py-2 text-xs text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {saving ? "guardando..." : "guardar desactivación"}
            </button>
            <button
              type="button"
              onClick={desbloquearDias}
              disabled={selectedDates.length === 0 || saving}
              className="rounded-full border border-primary/25 bg-white px-4 py-2 text-xs text-primary transition hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-45"
            >
              desbloquear días
            </button>
          </div>
        </div>

        {selectedDates.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedDates.map((fecha) => (
              <span
                key={fecha}
                className="rounded-full bg-white px-3 py-1 text-xs text-text/65"
              >
                {fecha}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
