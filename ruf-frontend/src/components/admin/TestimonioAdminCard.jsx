"use client";

import Image from "next/image";
import Link from "next/link";

export default function TestimonioAdminCard({
  testimonio,
  updating = false,
  deleting = false,
  onToggleEstado,
  onEliminar,
}) {
  return (
    <article className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {testimonio.foto ? (
          <Image
            src={testimonio.foto}
            alt={testimonio.nombre}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-background text-lg font-medium text-primary">
            {getInicial(testimonio.nombre)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg text-primary">{testimonio.nombre}</h2>
            <span className="rounded-full bg-background px-2.5 py-1 text-xs text-text/65">
              {testimonio.tipoProyecto}
            </span>
          </div>

          <p className="mt-2 text-sm text-primary">
            {"★".repeat(testimonio.estrellas)}
          </p>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-text/75">
        {testimonio.texto}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-text/75">
        <div className="rounded-xl bg-background px-3 py-2">
          <span className="block text-xs uppercase tracking-[0.16em] text-primary/60">
            estado
          </span>
          <span>{testimonio.estado}</span>
        </div>

        <div className="rounded-xl bg-background px-3 py-2">
          <span className="block text-xs uppercase tracking-[0.16em] text-primary/60">
            home
          </span>
          <span>{testimonio.mostrarEnHome ? "si" : "no"}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/admin/testimonios/${testimonio.id}/editar`}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-white transition hover:opacity-85"
        >
          editar
        </Link>

        <button
          type="button"
          disabled={updating}
          onClick={() => onToggleEstado(testimonio.id)}
          className="rounded-lg border border-primary/20 px-4 py-2 text-sm text-primary transition hover:bg-background"
        >
          {updating
            ? "actualizando..."
            : testimonio.estado === "activo"
              ? "ocultar"
              : "mostrar"}
        </button>

        <button
          type="button"
          disabled={deleting}
          onClick={() => onEliminar(testimonio.id)}
          className="rounded-lg border border-primary/20 px-4 py-2 text-sm text-primary transition hover:bg-background"
        >
          {deleting ? "eliminando..." : "eliminar"}
        </button>
      </div>
    </article>
  );
}

function getInicial(nombre) {
  return nombre?.trim()?.[0]?.toUpperCase() || "R";
}
