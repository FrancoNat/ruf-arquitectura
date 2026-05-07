"use client";

import Image from "next/image";
import Link from "next/link";
import { proyectos } from "@/data/proyectos";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Proyectos() {
  return (
    <section id="proyectos" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-2 text-3xl text-primary">proyectos destacados</h2>

            <p className="text-gray-500">
              cada proyecto es único, diseñado a medida
            </p>
          </div>

          <Link
            href="/proyectos"
            className="w-full rounded-lg border border-primary px-5 py-3 text-center text-primary transition hover:bg-primary hover:text-white sm:w-auto sm:shrink-0"
          >
            ver todos los proyectos
          </Link>
        </div>

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
            <SwiperSlide key={proyecto.id}>
              <article className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
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

                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-primary/60">
                      {proyecto.categoria}
                    </p>
                    <h3 className="mt-2 text-lg text-primary">
                      {proyecto.titulo}
                    </h3>
                  </div>

                  <Link
                    href="/proyectos"
                    className="inline-flex rounded-lg border border-primary px-4 py-2 text-sm text-primary transition hover:bg-primary hover:text-white"
                  >
                    ver todos los proyectos
                  </Link>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
