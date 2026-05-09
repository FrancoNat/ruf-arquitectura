"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProyectosDestacadosCarousel({ proyectos }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3500 }}
      loop
      spaceBetween={24}
      breakpoints={{
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="pb-12"
    >
      {proyectos.map((proyecto) => (
        <SwiperSlide key={proyecto.id} className="h-auto">
          <article className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
            <Link href={`/proyectos/${proyecto.id}`} className="group block">
              <div className="relative h-72 w-full overflow-hidden sm:h-80 md:h-64">
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
                <h3 className="mt-2 text-lg text-primary">
                  {proyecto.titulo}
                </h3>
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
                  className="inline-flex w-fit rounded-lg border border-primary px-4 py-2 text-sm text-primary transition hover:bg-primary hover:text-white"
                >
                  ver proyecto
                </Link>
              </div>
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
