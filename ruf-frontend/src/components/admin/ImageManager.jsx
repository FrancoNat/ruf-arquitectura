"use client";

import Image from "next/image";
import { useState } from "react";
import { useNotifications } from "@/components/ui/NotificationProvider";
import { uploadImage } from "@/services/uploads";

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
const MAX_UPLOAD_PIXELS = 8_000_000;
const MIN_JPEG_QUALITY = 0.62;
const VALID_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
]);

export default function ImageManager({
  imagenPrincipal,
  imagenes,
  onAgregarImagen,
  onEliminarImagen,
  onMarcarPrincipal,
  onMoverImagenArriba,
  onMoverImagenAbajo,
}) {
  const { error: notifyError, success } = useNotifications();
  const [archivos, setArchivos] = useState([]);
  const [inputKey, setInputKey] = useState(0);
  const [subiendo, setSubiendo] = useState(false);

  const handleUpload = async () => {
    if (archivos.length === 0) {
      notifyError("seleccioná una o más imágenes");
      return;
    }

    try {
      setSubiendo(true);
      const archivosPreparados = await prepararArchivos(archivos);
      const archivosSubibles = archivosPreparados
        .filter((resultado) => resultado.ok)
        .map((resultado) => resultado.archivo);
      const primerError = archivosPreparados.find((resultado) => !resultado.ok);
      const optimizadas = archivosPreparados.filter(
        (resultado) => resultado.ok && resultado.optimizada
      ).length;

      if (primerError) {
        notifyError(primerError.error);
      }

      if (archivosSubibles.length === 0) {
        return;
      }

      const resultados = await Promise.allSettled(
        archivosSubibles.map((archivo) => uploadImage(archivo))
      );
      const subidas = resultados
        .filter((resultado) => resultado.status === "fulfilled")
        .map((resultado) => resultado.value);
      const errores = resultados.filter(
        (resultado) => resultado.status === "rejected"
      );
      const fallidas = resultados.length - subidas.length;

      subidas.forEach((upload) => onAgregarImagen(upload.url));
      setArchivos([]);
      setInputKey((prev) => prev + 1);

      if (subidas.length > 0) {
        success(
          subidas.length === 1
            ? optimizadas > 0
              ? "imagen optimizada y subida"
              : "imagen subida"
            : `${subidas.length} imágenes subidas`
        );
      }

      if (fallidas > 0) {
        const primerErrorUpload =
          errores[0]?.reason?.data?.error ||
          errores[0]?.reason?.data?.detail ||
          errores[0]?.reason?.data?.title ||
          errores[0]?.reason?.message;
        notifyError(
          primerErrorUpload ||
            (fallidas === 1
              ? "1 imagen no se pudo subir"
              : `${fallidas} imágenes no se pudieron subir`)
        );
      }
    } catch (err) {
      notifyError(err.data?.error || "no pudimos subir la imagen");
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
            subí imágenes reales, elegí una principal y ordená la secuencia.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-black/5 bg-background p-4 sm:flex-row sm:items-center">
          <input
            key={inputKey}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={(event) =>
              setArchivos(Array.from(event.target.files || []))
            }
            className="w-full text-sm text-text/70 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:text-primary"
          />

          <button
            type="button"
            onClick={handleUpload}
            disabled={subiendo}
            className="rounded-xl bg-primary px-5 py-3 text-sm text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {subiendo
              ? "subiendo..."
              : archivos.length > 1
                ? `subir ${archivos.length} imágenes`
                : "subir imagen"}
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

async function prepararArchivos(archivos) {
  return Promise.all(archivos.map(prepararArchivo));
}

async function prepararArchivo(archivo) {
  if (!VALID_IMAGE_TYPES.has(archivo.type)) {
    return {
      ok: false,
      archivo,
      error: `${archivo.name}: formato no válido. Usá JPG o PNG.`,
    };
  }

  let dimensiones;
  try {
    dimensiones = await leerDimensionesImagen(archivo);
  } catch {
    return {
      ok: false,
      archivo,
      error: `${archivo.name}: no pudimos leer la imagen. Probá exportarla como JPG.`,
    };
  }

  const megapixeles = dimensiones.width * dimensiones.height;
  if (archivo.size <= MAX_UPLOAD_BYTES && megapixeles <= MAX_UPLOAD_PIXELS) {
    return { ok: true, archivo, optimizada: false };
  }

  try {
    const archivoOptimizado = await optimizarImagen(archivo, dimensiones);
    return { ok: true, archivo: archivoOptimizado, optimizada: true };
  } catch {
    return {
      ok: false,
      archivo,
      error: `${archivo.name}: no pudimos optimizar la imagen automáticamente. Probá con otro JPG o PNG.`,
    };
  }
}

async function optimizarImagen(archivo, dimensiones) {
  const escala = Math.min(
    1,
    Math.sqrt(MAX_UPLOAD_PIXELS / (dimensiones.width * dimensiones.height))
  );
  const width = Math.max(1, Math.floor(dimensiones.width * escala));
  const height = Math.max(1, Math.floor(dimensiones.height * escala));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("canvas no disponible");
  }

  const imagen = await cargarImagen(archivo);
  canvas.width = width;
  canvas.height = height;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(imagen, 0, 0, width, height);

  let calidad = 0.86;
  let blob = await canvasToBlob(canvas, calidad);

  while (blob.size > MAX_UPLOAD_BYTES && calidad > MIN_JPEG_QUALITY) {
    calidad = Math.max(MIN_JPEG_QUALITY, calidad - 0.08);
    blob = await canvasToBlob(canvas, calidad);
  }

  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new Error("imagen demasiado pesada");
  }

  return new File([blob], nombreJpg(archivo.name), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

function leerDimensionesImagen(archivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const imagen = new window.Image();

    imagen.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: imagen.naturalWidth,
        height: imagen.naturalHeight,
      });
    };

    imagen.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("no pudimos leer las dimensiones de la imagen"));
    };

    imagen.src = url;
  });
}

function cargarImagen(archivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const imagen = new window.Image();

    imagen.onload = () => {
      URL.revokeObjectURL(url);
      resolve(imagen);
    };

    imagen.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("no pudimos leer la imagen"));
    };

    imagen.src = url;
  });
}

function canvasToBlob(canvas, calidad) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("no pudimos comprimir la imagen"));
      },
      "image/jpeg",
      calidad
    );
  });
}

function nombreJpg(nombre) {
  return nombre.replace(/\.[^.]+$/, "") + ".jpg";
}
