"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProyectoAdminCard({ proyecto }) {
  return (
    <Link href={`/admin/proyectos/${proyecto.id}/editar`} className="group block h-full">
      <article className="h-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={proyecto.imagenPrincipal}
            alt={proyecto.titulo}
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="space-y-4 p-5">
          <div className="space-y-2">
            <h2 className="text-xl text-primary">{proyecto.titulo}</h2>
            <p className="text-sm text-text/70">{proyecto.categoria}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-text/75">
            <div className="rounded-xl bg-background px-3 py-2">
              <span className="block text-xs uppercase tracking-[0.16em] text-primary/60">
                estado
              </span>
              <span>{proyecto.estado}</span>
            </div>

            <div className="rounded-xl bg-background px-3 py-2">
              <span className="block text-xs uppercase tracking-[0.16em] text-primary/60">
                destacado
              </span>
              <span>{proyecto.destacado ? "si" : "no"}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
