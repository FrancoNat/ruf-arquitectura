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
      <h1 className="mb-6 text-3xl text-primary sm:text-4xl">
        {proyecto.titulo}
      </h1>

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

      <p className="text-text mb-10 leading-relaxed">{proyecto.descripcion}</p>

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
