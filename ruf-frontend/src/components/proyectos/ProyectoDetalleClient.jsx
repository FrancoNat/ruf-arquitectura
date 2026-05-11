"use client";

import "@fancyapps/ui/dist/fancybox/fancybox.css";
import Image from "next/image";
import { Fancybox } from "@fancyapps/ui";
import { useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function ProyectoDetalleClient({ proyecto }) {
  const categoriaNombre = proyecto.categoriaNombre || proyecto.categoria;

  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {});

    return () => {
      Fancybox.unbind("[data-fancybox]");
      Fancybox.close();
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/60">
          {categoriaNombre}
        </p>
        <h1 className="mt-3 text-3xl text-primary sm:text-4xl">
          {proyecto.titulo}
        </h1>
        {proyecto.descripcionCorta ? (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-text/70">
            {proyecto.descripcionCorta}
          </p>
        ) : null}
      </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className="ruf-swiper ruf-swiper-gallery mb-10 !pb-16"
      >
        {proyecto.imagenes.map((img, index) => (
          <SwiperSlide key={img}>
            <div className="overflow-hidden rounded-lg">
              <a
                href={img}
                data-fancybox="gallery"
                className="relative block h-[280px] sm:h-[420px] lg:h-[500px]"
              >
                <Image
                  src={img}
                  alt={
                    index === 0
                      ? proyecto.alt
                      : `${proyecto.titulo} desarrollado por rüf arquitectura`
                  }
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1279px) 80vw, 1200px"
                  className="cursor-zoom-in object-cover transition duration-500 hover:scale-105"
                />
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl text-primary">sobre el proyecto</h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-text/75">
            {proyecto.descripcionLarga || proyecto.descripcion}
          </p>
        </section>

        <aside className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl text-primary">ficha técnica</h2>
          <dl className="mt-5 divide-y divide-black/5 text-sm">
            <ProjectMeta label="categoría" value={categoriaNombre} />
            <ProjectMeta label="ubicación" value={proyecto.ubicacion} />
            <ProjectMeta label="año" value={proyecto.anio} />
            <ProjectMeta label="superficie" value={proyecto.superficie} />
          </dl>
        </aside>
      </div>

      <section className="mb-10 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary/55">
              servicio online
            </p>
            <h2 className="mt-3 text-2xl text-primary">¿qué incluye?</h2>
            <p className="mt-4 text-sm leading-relaxed text-text/65">
              modalidad 100% online. Podés hacerlo desde cualquier lugar.
            </p>
          </div>

          <div className="divide-y divide-black/5">
            {proyecto.incluye.map((etapa, index) => (
              <div
                key={`${etapa.titulo}-${index}`}
                className="grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[52px_1fr]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-sm text-primary">
                  {index + 1}
                </span>

                <div>
                  <h3 className="text-base text-primary">{etapa.titulo}</h3>
                  <p className="mt-2 leading-relaxed text-text/70">
                    {etapa.descripcion}
                  </p>

                  {etapa.items.length > 0 ? (
                    <ul className="mt-3 grid gap-2 text-sm text-text/70 sm:grid-cols-2">
                      {etapa.items.map((item, itemIndex) => (
                        <li key={`${item}-${itemIndex}`} className="flex gap-2">
                          <span className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-primary/55" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
        <Link
          href="/proyectos"
          className="inline-flex rounded-full border border-primary/25 px-4 py-2 text-sm text-primary transition hover:bg-primary hover:text-white sm:rounded-lg sm:px-6 sm:py-3 sm:text-base"
        >
          ver todos los proyectos
        </Link>

        <a
          href="/agenda"
          className="inline-flex rounded-full bg-primary px-4 py-2 text-sm text-white transition hover:opacity-80 sm:rounded-lg sm:px-6 sm:py-3 sm:text-base"
        >
          agendar reunión
        </a>
      </div>
    </div>
  );
}

function ProjectMeta({ label, value }) {
  if (!value) return null;

  return (
    <div className="grid grid-cols-[110px_1fr] gap-4 py-3">
      <dt className="text-text/50">{label}</dt>
      <dd className="text-text/80">{value}</dd>
    </div>
  );
}
