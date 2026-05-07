"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function TestimoniosCarousel({ testimonios }) {
  return (
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
      {testimonios.map((testimonio) => (
        <SwiperSlide key={testimonio.id} className="h-auto">
          <div className="group overflow-hidden rounded-xl">
            <div className="flex h-[260px] flex-col justify-between rounded-xl bg-primary p-6 shadow-sm transition duration-500 group-hover:scale-105">
              <div className="mb-4 text-background">
                {"⭐".repeat(testimonio.estrellas)}
              </div>

              <p className="mb-6 leading-relaxed text-background">
                “{testimonio.texto}”
              </p>

              <div className="mt-auto flex items-center gap-3">
                <Image
                  src={testimonio.foto}
                  alt={testimonio.nombre}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div>
                  <p className="text-sm font-medium text-background">
                    {testimonio.nombre}
                  </p>
                  <p className="text-xs text-background/70">
                    {testimonio.tipo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
