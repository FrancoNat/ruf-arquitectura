"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const filtros = [
  { value: "todos", label: "todos" },
  { value: "casa", label: "casa" },
  { value: "interior", label: "departamento interior" },
  { value: "mueble", label: "muebles" },
];

export default function ProyectosGrid({ proyectos }) {
  const [filtroActivo, setFiltroActivo] = useState("todos");

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
            className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm"
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

            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-primary/60">
                  {proyecto.categoria}
                </p>
                <h2 className="mt-2 text-lg text-primary">
                  {proyecto.titulo}
                </h2>
              </div>

              <Link
                href={`/proyectos/${proyecto.id}`}
                className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm text-white transition hover:opacity-85"
              >
                ver proyecto
              </Link>
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
