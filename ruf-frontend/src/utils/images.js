const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
const MAX_UPLOAD_PIXELS = 8_000_000;
const MIN_JPEG_QUALITY = 0.62;
const VALID_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);

export async function prepararArchivoImagen(archivo) {
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

export async function prepararArchivosImagen(archivos) {
  return Promise.all(archivos.map(prepararArchivoImagen));
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
