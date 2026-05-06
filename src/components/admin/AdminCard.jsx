export default function AdminCard({
  titulo,
  valor,
  descripcion,
  children,
  className = "",
}) {
  return (
    <div
      className={`rounded-2xl border border-black/5 bg-white p-5 shadow-sm ${className}`}
    >
      <p className="text-xs tracking-[0.18em] text-primary/60 uppercase">
        {titulo}
      </p>

      {valor ? (
        <p className="mt-3 text-3xl font-light text-primary">{valor}</p>
      ) : null}

      {descripcion ? (
        <p className="mt-2 text-sm leading-relaxed text-text/70">
          {descripcion}
        </p>
      ) : null}

      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
