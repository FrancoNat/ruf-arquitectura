export default function AdminCard({
  titulo,
  valor,
  descripcion,
  children,
  className = "",
}) {
  return (
    <div
      className={`rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      <p className="text-[0.68rem] tracking-[0.14em] text-primary/60 uppercase sm:text-xs sm:tracking-[0.18em]">
        {titulo}
      </p>

      {valor ? (
        <p className="mt-3 text-2xl font-light text-primary sm:text-3xl">
          {valor}
        </p>
      ) : null}

      {descripcion ? (
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-text/70 sm:text-sm">
          {descripcion}
        </p>
      ) : null}

      {children ? <div className="mt-3 sm:mt-4">{children}</div> : null}
    </div>
  );
}
