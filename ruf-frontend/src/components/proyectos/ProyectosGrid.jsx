"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProyectosGrid({ proyectos, categorias = [] }) {
  const [filtroActivo, setFiltroActivo] = useState("todos");

  const filtros = useMemo(
    () => [
      { value: "todos", label: "todos" },
      ...categorias.map((categoria) => ({
        value: categoria.id,
        label: categoria.nombre,
      })),
    ],
    [categorias]
  );

  const proyectosFiltrados = useMemo(() => {
    if (filtroActivo === "todos") {
      return proyectos;
    }

    return proyectos.filter((proyecto) => proyecto.categoria === filtroActivo);
  }, [filtroActivo, proyectos]);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-3 sm:mb-10">
        {filtros.map((filtro) => (
          <button
            key={filtro.value}
            type="button"
            onClick={() => setFiltroActivo(filtro.value)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              filtroActivo === filtro.value
                ? "bg-primary text-white"
                : "border border-primary/20 bg-white text-primary hover:bg-background"
            }`}
          >
            {filtro.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {proyectosFiltrados.map((proyecto) => (
          <article
            key={proyecto.id}
            className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm"
          >
            <Link href={`/proyectos/${proyecto.id}`} className="group block">
              <div className="relative h-72 overflow-hidden sm:h-80 md:h-64">
                <Image
                  src={proyecto.imagen}
                  alt={proyecto.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            </Link>

            <div className="flex flex-1 flex-col p-5">
              <div className="min-h-[132px]">
                <p className="text-xs uppercase tracking-[0.18em] text-primary/60">
                  {proyecto.categoria}
                </p>
                <h2 className="mt-2 text-lg text-primary">
                  {proyecto.titulo}
                </h2>
                {proyecto.descripcionCorta ? (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text/65">
                    {proyecto.descripcionCorta}
                  </p>
                ) : null}
              </div>

              <div className="mt-4 grid min-h-[72px] grid-cols-2 gap-2 text-xs text-text/60">
                {proyecto.ubicacion ? (
                  <span className="line-clamp-2 rounded-lg bg-background px-3 py-2">
                    {proyecto.ubicacion}
                  </span>
                ) : null}
                {proyecto.anio ? (
                  <span className="rounded-lg bg-background px-3 py-2">
                    {proyecto.anio}
                  </span>
                ) : null}
                {proyecto.superficie ? (
                  <span className="rounded-lg bg-background px-3 py-2">
                    {proyecto.superficie}
                  </span>
                ) : null}
              </div>

              <div className="mt-auto pt-5">
                <Link
                  href={`/proyectos/${proyecto.id}`}
                  className="inline-flex w-fit rounded-lg bg-primary px-4 py-2 text-sm text-white transition hover:opacity-85"
                >
                  ver proyecto
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {proyectosFiltrados.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-black/10 bg-white px-4 py-6 text-sm text-text/60">
          no hay proyectos cargados para este filtro.
        </div>
      ) : null}
    </>
  );
}
