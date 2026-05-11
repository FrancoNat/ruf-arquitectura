"use client";

import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const MAX_INLINE_TEXT = 170;

export default function TestimoniosCarousel({ testimonios }) {
  const [testimonioAbierto, setTestimonioAbierto] = useState(null);

  return (
    <>
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
        {testimonios.map((testimonio) => {
          const tieneTextoLargo =
            (testimonio.texto || "").length > MAX_INLINE_TEXT;

          return (
            <SwiperSlide key={testimonio.id} className="h-auto">
              <div className="group overflow-hidden rounded-xl">
                <div className="flex min-h-[210px] flex-col justify-between rounded-xl bg-primary p-5 shadow-sm transition duration-500 group-hover:scale-105 sm:h-[260px] sm:p-6">
                  <div className="mb-3 text-sm text-background sm:mb-4 sm:text-base">
                    {"⭐".repeat(testimonio.estrellas)}
                  </div>

                  <button
                    type="button"
                    onClick={() => setTestimonioAbierto(testimonio)}
                    className="mb-4 text-left text-sm leading-relaxed text-background outline-none transition focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-background/60 sm:text-base"
                    aria-label={`leer testimonio completo de ${testimonio.nombre}`}
                  >
                    <span className="line-clamp-4">“{testimonio.texto}”</span>
                  </button>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <TestimonioAvatar testimonio={testimonio} />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-background">
                          {testimonio.nombre}
                        </p>
                        <p className="truncate text-xs text-background/70">
                          {testimonio.tipo}
                        </p>
                      </div>
                    </div>

                    {tieneTextoLargo ? (
                      <button
                        type="button"
                        onClick={() => setTestimonioAbierto(testimonio)}
                        className="shrink-0 rounded-full border border-background/20 px-3 py-1.5 text-xs text-background transition hover:bg-background/10"
                      >
                        leer
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {testimonioAbierto ? (
        <TestimonioModal
          testimonio={testimonioAbierto}
          onClose={() => setTestimonioAbierto(null)}
        />
      ) : null}
    </>
  );
}

function TestimonioModal({ testimonio, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-primary/25 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <article
        className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-black/5 bg-[#fffaf4] p-6 shadow-[0_28px_80px_rgba(44,32,24,0.22)] sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <TestimonioAvatar testimonio={testimonio} variant="modal" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary/50">
                testimonio
              </p>
              <h2 className="mt-1 text-2xl font-light text-primary">
                {testimonio.nombre}
              </h2>
              <p className="mt-1 text-sm text-text/60">{testimonio.tipo}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-primary/15 px-3 py-1.5 text-sm text-primary transition hover:bg-white"
            aria-label="cerrar testimonio"
          >
            ×
          </button>
        </div>

        <div className="mt-6 text-sm text-primary">
          {"⭐".repeat(testimonio.estrellas)}
        </div>

        <p className="mt-4 text-base leading-relaxed text-text/75 sm:text-lg">
          “{testimonio.texto}”
        </p>
      </article>
    </div>
  );
}

function TestimonioAvatar({ testimonio, variant = "card" }) {
  const sizeClass =
    variant === "modal"
      ? "h-14 w-14 text-lg"
      : "h-9 w-9 text-sm sm:h-10 sm:w-10";

  if (testimonio.foto) {
    const imageSize = variant === "modal" ? 56 : 40;

    return (
      <Image
        src={testimonio.foto}
        alt={testimonio.nombre}
        width={imageSize}
        height={imageSize}
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full border border-background/25 bg-background/10 font-medium text-background ${variant === "modal" ? "border-primary/15 bg-white text-primary" : ""}`}
    >
      {getInicial(testimonio.nombre)}
    </div>
  );
}

function getInicial(nombre) {
  return nombre?.trim()?.[0]?.toUpperCase() || "R";
}
