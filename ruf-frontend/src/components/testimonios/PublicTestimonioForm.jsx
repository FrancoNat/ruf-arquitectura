"use client";

import { useEffect, useMemo, useState } from "react";
import StarsInput from "@/components/admin/StarsInput";
import { useNotifications } from "@/components/ui/NotificationProvider";
import { getCategorias } from "@/services/categorias";
import { createPublicTestimonio } from "@/services/testimonios";

const opcionesFallback = [
  "asesoria online",
  "arquitectura",
  "interiorismo",
  "muebles a medida",
];

const initialForm = {
  nombre: "",
  tipoProyecto: "",
  texto: "",
  estrellas: 5,
};

export default function PublicTestimonioForm() {
  const { error: notifyError, success } = useNotifications();
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let activo = true;

    getCategorias()
      .then((data) => {
        if (!activo) return;
        setCategorias(data);
      })
      .catch(() => {
        if (!activo) return;
        setCategorias([]);
      })
      .finally(() => {
        if (!activo) return;
        setLoadingCategorias(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const opcionesProyecto = useMemo(() => {
    const nombres = categorias.map((categoria) => categoria.nombre);
    return nombres.length > 0 ? nombres : opcionesFallback;
  }, [categorias]);

  useEffect(() => {
    if (form.tipoProyecto || opcionesProyecto.length === 0) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      tipoProyecto: opcionesProyecto[0],
    }));
  }, [form.tipoProyecto, opcionesProyecto]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitted(false);

    if (!form.nombre.trim() || !form.tipoProyecto.trim() || !form.texto.trim()) {
      notifyError("completá todos los campos para enviar el testimonio");
      return;
    }

    setSubmitting(true);

    try {
      await createPublicTestimonio(form);
      setForm({
        ...initialForm,
        tipoProyecto: opcionesProyecto[0] || "",
      });
      setSubmitted(true);
      success("testimonio enviado");
    } catch (error) {
      notifyError(
        error?.data?.error || "no pudimos enviar el testimonio, probá de nuevo"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-primary">
          <span className="mb-2 block">nombre</span>
          <input
            type="text"
            value={form.nombre}
            onChange={(event) => updateField("nombre", event.target.value)}
            placeholder="tu nombre"
            className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-text outline-none transition focus:border-primary"
            maxLength={120}
            required
          />
        </label>

        <label className="block text-sm text-primary">
          <span className="mb-2 block">servicio o proyecto</span>
          <select
            value={form.tipoProyecto}
            onChange={(event) =>
              updateField("tipoProyecto", event.target.value)
            }
            disabled={loadingCategorias}
            className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-text outline-none transition focus:border-primary disabled:opacity-60"
            required
          >
            {opcionesProyecto.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm text-primary">
        <span className="mb-2 block">tu experiencia</span>
        <textarea
          value={form.texto}
          onChange={(event) => updateField("texto", event.target.value)}
          placeholder="contanos cómo fue trabajar con rüf"
          rows={6}
          maxLength={1000}
          className="w-full resize-none rounded-xl border border-primary/15 bg-background px-4 py-3 leading-relaxed text-text outline-none transition focus:border-primary"
          required
        />
        <span className="mt-2 block text-xs text-text/45">
          {form.texto.length}/1000
        </span>
      </label>

      <div>
        <p className="mb-2 text-sm text-primary">calificación</p>
        <StarsInput
          value={form.estrellas}
          onChange={(value) => updateField("estrellas", value)}
        />
      </div>

      {submitted ? (
        <div className="rounded-xl border border-primary/10 bg-[#fffaf4] px-4 py-3 text-sm leading-relaxed text-text/70">
          gracias por compartir tu experiencia. El testimonio queda en revisión
          antes de publicarse.
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex rounded-full bg-primary px-5 py-3 text-sm text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-lg sm:px-6"
      >
        {submitting ? "enviando..." : "enviar testimonio"}
      </button>
    </form>
  );
}
