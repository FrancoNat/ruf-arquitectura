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
      className="ruf-swiper !pb-16"
    >
      {testimonios.map((testimonio) => (
        <SwiperSlide key={testimonio.id} className="h-auto">
          <div className="group overflow-hidden rounded-xl">
            <div className="flex min-h-[210px] flex-col justify-between rounded-xl bg-primary p-5 shadow-sm transition duration-500 group-hover:scale-105 sm:h-[260px] sm:p-6">
              <div className="mb-3 text-sm text-background sm:mb-4 sm:text-base">
                {"⭐".repeat(testimonio.estrellas)}
              </div>

              <p className="mb-5 line-clamp-4 text-sm leading-relaxed text-background sm:mb-6 sm:text-base">
                “{testimonio.texto}”
              </p>

              <div className="mt-auto flex items-center gap-3">
                <Image
                  src={testimonio.foto}
                  alt={testimonio.nombre}
                  width={40}
                  height={40}
                  className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
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
