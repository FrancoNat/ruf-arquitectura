"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function Testimonios() {
  const testimonios = [
    {
      texto:
        "nos acompañaron en todo el proceso, desde la idea hasta la ejecución. super profesionales.",
      nombre: "maría g.",
      tipo: "vivienda",
      foto: "/images/testimonios/maria-g.jpg",
      estrellas: 5,
    },
    {
      texto:
        "lograron exactamente lo que queríamos. el diseño y los detalles fueron impecables.",
      nombre: "juan p.",
      tipo: "interiorismo",
      foto: "/images/testimonios/juan-p.avif",
      estrellas: 5,
    },
    {
      texto:
        "cumplieron tiempos y presupuesto. volveríamos a elegirlas sin dudar.",
      nombre: "lucas r.",
      tipo: "muebles a medida",
      foto: "/images/testimonios/lucas-r.jpg",
      estrellas: 5,
    },
  ];

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-12 text-3xl text-primary">
          lo que dicen nuestros clientes
        </h2>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          loop
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {testimonios.map((t, index) => (
            <SwiperSlide key={index} className="h-auto">
              <div className="group overflow-hidden rounded-xl">
                <div className="flex h-[260px] flex-col justify-between rounded-xl bg-primary p-6 shadow-sm transition duration-500 group-hover:scale-105">
                  <div className="mb-4 text-background">
                    {"⭐".repeat(t.estrellas)}
                  </div>

                  <p className="mb-6 leading-relaxed text-background">
                    “{t.texto}”
                  </p>

                  <div className="mt-auto flex items-center gap-3">
                    <Image
                      src={t.foto}
                      alt={t.nombre}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />

                    <div>
                      <p className="text-sm font-medium text-background">
                        {t.nombre}
                      </p>
                      <p className="text-xs text-background/70">{t.tipo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
