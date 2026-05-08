"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import StarsInput from "./StarsInput";
import { uploadImage } from "@/services/uploads";

const baseState = {
  nombre: "",
  tipoProyecto: "vivienda",
  texto: "",
  estrellas: 5,
  foto: "",
  estado: "activo",
  mostrarEnHome: true,
};

export default function TestimonioForm({
  initialData = null,
  mode = "nuevo",
  onSubmit,
  isSubmitting = false,
}) {
  const initialState = useMemo(
    () => ({
      ...baseState,
      ...initialData,
    }),
    [initialData]
  );

  const [form, setForm] = useState(initialState);
  const [archivo, setArchivo] = useState(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const testimonio = {
      nombre: form.nombre,
      tipoProyecto: form.tipoProyecto,
      texto: form.texto,
      estrellas: Number(form.estrellas),
      foto: form.foto,
      estado: form.estado,
      mostrarEnHome: form.mostrarEnHome,
    };

    if (onSubmit) {
      await onSubmit(testimonio);
      return;
    }

    console.log(`${mode} testimonio`, testimonio);
  };

  const handleUploadFoto = async () => {
    if (!archivo) {
      alert("seleccioná una foto");
      return;
    }

    try {
      setSubiendoFoto(true);
      const url = await uploadImage(archivo);
      setForm((prev) => ({ ...prev, foto: url }));
      setArchivo(null);
      alert("foto subida");
    } catch (err) {
      alert(err.data?.error || "no pudimos subir la foto");
    } finally {
      setSubiendoFoto(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-text/80">
            <span>nombre del cliente</span>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2 text-sm text-text/80">
            <span>tipo de proyecto</span>
            <select
              name="tipoProyecto"
              value={form.tipoProyecto}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="vivienda">vivienda</option>
              <option value="interiorismo">interiorismo</option>
              <option value="muebles a medida">muebles a medida</option>
              <option value="otro">otro</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-text/80 md:col-span-2">
            <span>texto de la reseña</span>
            <textarea
              name="texto"
              value={form.texto}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <div className="space-y-2 text-sm text-text/80">
            <span>estrellas</span>
            <StarsInput
              value={form.estrellas}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, estrellas: value }))
              }
            />
          </div>

          <label className="space-y-2 text-sm text-text/80">
            <span>foto</span>
            <input
              type="text"
              name="foto"
              value={form.foto}
              onChange={handleChange}
              placeholder="/images/clientes/cliente1.jpg"
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <div className="space-y-3 rounded-xl border border-black/5 bg-background p-4 text-sm text-text/80">
            <span>subir foto</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={(event) => setArchivo(event.target.files?.[0] || null)}
              className="w-full text-sm text-text/70 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:text-primary"
            />
            <button
              type="button"
              onClick={handleUploadFoto}
              disabled={subiendoFoto}
              className="rounded-xl bg-primary px-4 py-2 text-sm text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {subiendoFoto ? "subiendo..." : "subir foto"}
            </button>
          </div>

          {form.foto ? (
            <div className="space-y-2 text-sm text-text/80">
              <span>preview</span>
              <div className="relative h-32 overflow-hidden rounded-xl border border-black/5 bg-background">
                <Image
                  src={form.foto}
                  alt={`foto de ${form.nombre || "cliente"}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}

          <label className="space-y-2 text-sm text-text/80">
            <span>estado</span>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="activo">activo</option>
              <option value="inactivo">inactivo</option>
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-black/10 bg-background px-4 py-3 text-sm text-text/80 md:col-span-2">
            <input
              type="checkbox"
              name="mostrarEnHome"
              checked={form.mostrarEnHome}
              onChange={handleChange}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            <span>mostrar en home</span>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-5 py-3 text-sm text-white transition hover:opacity-85"
        >
          {isSubmitting ? "guardando..." : "guardar testimonio"}
        </button>
      </div>
    </form>
  );
}
