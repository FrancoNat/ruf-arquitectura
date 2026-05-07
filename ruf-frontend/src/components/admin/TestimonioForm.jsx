"use client";

import { useMemo, useState } from "react";
import StarsInput from "./StarsInput";

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
