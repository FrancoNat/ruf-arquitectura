import Link from "next/link";

export default function ColaboradorCard({ usuario, onDeactivate, disabled }) {
  return (
    <article className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg text-primary">{usuario.nombre}</p>
          <p className="mt-1 text-sm text-text/60">{usuario.email}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-background px-3 py-1 text-text/70">
              {usuario.rol}
            </span>
            <span className="rounded-full bg-background px-3 py-1 text-text/70">
              {usuario.activo ? "activo" : "inactivo"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/colaboradores/${usuario.id}/editar`}
            className="rounded-xl border border-primary/15 px-4 py-2 text-sm text-primary transition hover:bg-background"
          >
            editar
          </Link>
          <button
            type="button"
            onClick={() => onDeactivate(usuario.id)}
            disabled={disabled || !usuario.activo}
            className="rounded-xl bg-primary px-4 py-2 text-sm text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-55"
          >
            desactivar
          </button>
        </div>
      </div>
    </article>
  );
}
