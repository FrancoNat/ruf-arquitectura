"use client";

import "@fancyapps/ui/dist/fancybox/fancybox.css";
import Image from "next/image";
import { Fancybox } from "@fancyapps/ui";
import { useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProyectoDetalleClient({ proyecto }) {
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
          {proyecto.categoria}
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
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className="mb-10"
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
            <ProjectMeta label="categoría" value={proyecto.categoria} />
            <ProjectMeta label="ubicación" value={proyecto.ubicacion} />
            <ProjectMeta label="año" value={proyecto.anio} />
            <ProjectMeta label="superficie" value={proyecto.superficie} />
          </dl>
        </aside>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/proyectos"
          className="inline-flex rounded-lg border border-primary px-6 py-3 text-primary transition hover:bg-primary hover:text-white"
        >
          ver todos los proyectos
        </Link>

        <a
          href="/agenda"
          className="inline-flex rounded-lg bg-primary px-6 py-3 text-white transition hover:opacity-80"
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
