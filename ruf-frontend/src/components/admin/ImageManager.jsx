"use client";

import Image from "next/image";
import { useState } from "react";
import { uploadImage } from "@/services/uploads";

export default function ImageManager({
  imagenPrincipal,
  imagenes,
  onAgregarImagen,
  onEliminarImagen,
  onMarcarPrincipal,
  onMoverImagenArriba,
  onMoverImagenAbajo,
}) {
  const [nuevaImagen, setNuevaImagen] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const handleAgregar = () => {
    const ruta = nuevaImagen.trim();

    if (!ruta) {
      alert("completa una ruta de imagen");
      return;
    }

    onAgregarImagen(ruta);
    setNuevaImagen("");
  };

  const handleUpload = async () => {
    if (!archivo) {
      alert("seleccioná una imagen");
      return;
    }

    try {
      setSubiendo(true);
      const url = await uploadImage(archivo);
      onAgregarImagen(url);
      setArchivo(null);
      alert("imagen subida");
    } catch (err) {
      alert(err.data?.error || "no pudimos subir la imagen");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-text/80">galería de imágenes</p>
          <p className="mt-1 text-xs leading-relaxed text-text/55">
            subí imágenes reales o agregá rutas manuales, elegí una principal y ordená la secuencia.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-black/5 bg-background p-4 sm:flex-row sm:items-center">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={(event) => setArchivo(event.target.files?.[0] || null)}
            className="w-full text-sm text-text/70 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:text-primary"
          />

          <button
            type="button"
            onClick={handleUpload}
            disabled={subiendo}
            className="rounded-xl bg-primary px-5 py-3 text-sm text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {subiendo ? "subiendo..." : "subir imagen"}
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={nuevaImagen}
            onChange={(event) => setNuevaImagen(event.target.value)}
            placeholder="/images/proyectos/departamento.jpg"
            className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
          />

          <button
            type="button"
            onClick={handleAgregar}
            className="rounded-xl bg-primary px-5 py-3 text-sm text-white transition hover:opacity-85"
          >
            agregar imagen
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {imagenes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/10 bg-background px-4 py-6 text-sm text-text/55 sm:col-span-2 xl:col-span-3">
            todavía no hay imágenes cargadas.
          </div>
        ) : null}

        {imagenes.map((img, index) => (
          <div
            key={`${img}-${index}`}
            className="overflow-hidden rounded-2xl border border-black/5 bg-background"
          >
            <div className="relative h-40 w-full">
              <Image
                src={img}
                alt={`imagen ${index + 1}`}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="space-y-3 p-4">
              <p className="truncate text-xs text-text/60">{img}</p>

              <div className="rounded-lg bg-white px-3 py-2 text-xs text-text/70">
                principal: {imagenPrincipal === img ? "si" : "no"}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onMarcarPrincipal(img)}
                  className="rounded-lg bg-primary px-3 py-2 text-xs text-white transition hover:opacity-85"
                >
                  principal
                </button>

                <button
                  type="button"
                  onClick={() => onEliminarImagen(index)}
                  className="rounded-lg border border-primary/20 px-3 py-2 text-xs text-primary transition hover:bg-white"
                >
                  eliminar
                </button>

                <button
                  type="button"
                  onClick={() => onMoverImagenArriba(index)}
                  disabled={index === 0}
                  className="rounded-lg border border-primary/20 px-3 py-2 text-xs text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  subir
                </button>

                <button
                  type="button"
                  onClick={() => onMoverImagenAbajo(index)}
                  disabled={index === imagenes.length - 1}
                  className="rounded-lg border border-primary/20 px-3 py-2 text-xs text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  bajar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
