"use client";

import { useMemo, useState } from "react";
import {
  ADMIN_CATEGORIAS_STORAGE_KEY,
  adminCategoriasIniciales,
} from "@/data/adminCategorias";
import ImageManager from "./ImageManager";

const baseState = {
  titulo: "",
  categoria: adminCategoriasIniciales[0].id,
  descripcionCorta: "",
  descripcionLarga: "",
  ubicacion: "",
  anio: "",
  superficie: "",
  estado: "publicado",
  destacado: false,
  imagenPrincipal: "",
  imagenes: [],
};

export default function ProyectoForm({
  initialData = null,
  mode = "nuevo",
  onSubmit,
  isSubmitting = false,
}) {
  const initialState = useMemo(
    () => ({
      ...baseState,
      ...initialData,
      imagenes: initialData?.imagenes ?? [],
      imagenPrincipal: initialData?.imagenPrincipal ?? "",
    }),
    [initialData]
  );

  const [form, setForm] = useState(initialState);
  const categorias = useMemo(() => {
    if (typeof window === "undefined") {
      return adminCategoriasIniciales;
    }

    const categoriasGuardadas = window.localStorage.getItem(
      ADMIN_CATEGORIAS_STORAGE_KEY
    );

    if (!categoriasGuardadas) {
      return adminCategoriasIniciales;
    }

    try {
      const categoriasParseadas = JSON.parse(categoriasGuardadas);

      if (Array.isArray(categoriasParseadas) && categoriasParseadas.length > 0) {
        return categoriasParseadas;
      }
    } catch {
      window.localStorage.removeItem(ADMIN_CATEGORIAS_STORAGE_KEY);
    }

    return adminCategoriasIniciales;
  }, []);
  const categoriaActual = categorias.some(
    (categoria) => categoria.id === form.categoria
  )
    ? form.categoria
    : categorias[0].id;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // agrega una imagen a la galeria y define una principal si todavia no existe
  const agregarImagen = (ruta) => {
    setForm((prev) => {
      if (prev.imagenes.includes(ruta)) {
        alert("esa imagen ya fue agregada");
        return prev;
      }

      const nuevasImagenes = [...prev.imagenes, ruta];

      return {
        ...prev,
        imagenes: nuevasImagenes,
        imagenPrincipal: prev.imagenPrincipal || ruta,
      };
    });
  };

  // elimina la imagen y actualiza la principal si hacia falta
  const eliminarImagen = (index) => {
    setForm((prev) => {
      const nuevasImagenes = prev.imagenes.filter((_, current) => current !== index);
      const imagenEliminada = prev.imagenes[index];

      return {
        ...prev,
        imagenes: nuevasImagenes,
        imagenPrincipal:
          prev.imagenPrincipal === imagenEliminada
            ? nuevasImagenes[0] || ""
            : prev.imagenPrincipal,
      };
    });
  };

  const marcarPrincipal = (img) => {
    setForm((prev) => ({
      ...prev,
      imagenPrincipal: img,
    }));
  };

  const moverImagenArriba = (index) => {
    if (index === 0) return;

    setForm((prev) => {
      const nuevasImagenes = [...prev.imagenes];
      [nuevasImagenes[index - 1], nuevasImagenes[index]] = [
        nuevasImagenes[index],
        nuevasImagenes[index - 1],
      ];

      return {
        ...prev,
        imagenes: nuevasImagenes,
      };
    });
  };

  const moverImagenAbajo = (index) => {
    setForm((prev) => {
      if (index === prev.imagenes.length - 1) return prev;

      const nuevasImagenes = [...prev.imagenes];
      [nuevasImagenes[index], nuevasImagenes[index + 1]] = [
        nuevasImagenes[index + 1],
        nuevasImagenes[index],
      ];

      return {
        ...prev,
        imagenes: nuevasImagenes,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const proyecto = {
      titulo: form.titulo,
      categoria: categoriaActual,
      descripcionCorta: form.descripcionCorta,
      descripcionLarga: form.descripcionLarga,
      ubicacion: form.ubicacion,
      anio: form.anio,
      superficie: form.superficie,
      estado: form.estado,
      destacado: form.destacado,
      imagenPrincipal: form.imagenPrincipal,
      imagenes: form.imagenes,
    };

    if (onSubmit) {
      await onSubmit(proyecto);
      return;
    }

    console.log(`${mode} proyecto`, proyecto);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-text/80">
            <span>titulo</span>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2 text-sm text-text/80">
            <span>categoria</span>
            <select
              name="categoria"
              value={categoriaActual}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-text/80 md:col-span-2">
            <span>descripcion corta</span>
            <input
              type="text"
              name="descripcionCorta"
              value={form.descripcionCorta}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2 text-sm text-text/80 md:col-span-2">
            <span>descripcion larga</span>
            <textarea
              name="descripcionLarga"
              value={form.descripcionLarga}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2 text-sm text-text/80">
            <span>ubicacion</span>
            <input
              type="text"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2 text-sm text-text/80">
            <span>año</span>
            <input
              type="text"
              name="anio"
              value={form.anio}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2 text-sm text-text/80">
            <span>superficie</span>
            <input
              type="text"
              name="superficie"
              value={form.superficie}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2 text-sm text-text/80">
            <span>estado</span>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="publicado">publicado</option>
              <option value="borrador">borrador</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-text/80 md:col-span-2">
            <span>imagen principal</span>
            <input
              type="text"
              name="imagenPrincipal"
              value={form.imagenPrincipal}
              onChange={handleChange}
              placeholder="/images/proyectos/..."
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-black/10 bg-background px-4 py-3 text-sm text-text/80 md:col-span-2">
            <input
              type="checkbox"
              name="destacado"
              checked={form.destacado}
              onChange={handleChange}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            <span>destacado</span>
          </label>
        </div>
      </div>

      <ImageManager
        imagenPrincipal={form.imagenPrincipal}
        imagenes={form.imagenes}
        onAgregarImagen={agregarImagen}
        onEliminarImagen={eliminarImagen}
        onMarcarPrincipal={marcarPrincipal}
        onMoverImagenArriba={moverImagenArriba}
        onMoverImagenAbajo={moverImagenAbajo}
      />

      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-5 py-3 text-sm text-white transition hover:opacity-85"
        >
          {isSubmitting ? "guardando..." : "guardar proyecto"}
        </button>
      </div>
    </form>
  );
}
