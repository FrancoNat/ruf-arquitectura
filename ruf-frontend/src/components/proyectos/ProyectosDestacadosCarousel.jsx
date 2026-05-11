"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function ProyectosDestacadosCarousel({ proyectos }) {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3500 }}
      loop
      spaceBetween={24}
      breakpoints={{
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="ruf-swiper !pb-16"
    >
      {proyectos.map((proyecto) => (
        <SwiperSlide key={proyecto.id} className="!h-auto">
          <Link
            href={`/proyectos/${proyecto.id}`}
            className="group block h-full"
          >
            <article className="flex h-[390px] flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm sm:h-[430px] md:h-[360px]">
              <div className="relative h-[280px] w-full shrink-0 overflow-hidden sm:h-[320px] md:h-[248px]">
                <Image
                  src={proyecto.imagen}
                  alt={proyecto.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex min-h-0 flex-1 flex-col justify-start p-5">
                <p className="line-clamp-1 text-xs uppercase tracking-[0.18em] text-primary/60">
                  {proyecto.categoriaNombre || proyecto.categoria}
                </p>
                <h3 className="mt-2 line-clamp-2 text-lg leading-snug text-primary">
                  {proyecto.titulo}
                </h3>
              </div>
            </article>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
