"use client";

import { useEffect, useMemo, useState } from "react";
import StarsInput from "@/components/admin/StarsInput";
import { useNotifications } from "@/components/ui/NotificationProvider";
import { getCategorias } from "@/services/categorias";
import { createPublicTestimonio } from "@/services/testimonios";
import { prepararArchivoImagen } from "@/utils/images";

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
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const [fotoInputKey, setFotoInputKey] = useState(0);

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

  useEffect(() => {
    return () => {
      if (fotoPreview) {
        URL.revokeObjectURL(fotoPreview);
      }
    };
  }, [fotoPreview]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateFoto = (file) => {
    setFoto(file);
    if (!file) {
      setFotoInputKey((prev) => prev + 1);
    }
    setFotoPreview((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }

      return file ? URL.createObjectURL(file) : "";
    });
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
      let fotoPreparada = null;

      if (foto) {
        const resultadoFoto = await prepararArchivoImagen(foto);
        if (!resultadoFoto.ok) {
          notifyError(resultadoFoto.error);
          return;
        }

        fotoPreparada = resultadoFoto.archivo;
      }

      await createPublicTestimonio({
        ...form,
        foto: fotoPreparada,
      });
      setForm({
        ...initialForm,
        tipoProyecto: opcionesProyecto[0] || "",
      });
      updateFoto(null);
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

      <div className="rounded-xl border border-primary/10 bg-background p-4">
        <label className="block text-sm text-primary">
          <span className="mb-2 block">foto opcional</span>
          <input
            key={fotoInputKey}
            type="file"
            accept="image/jpeg,image/png"
            onChange={(event) => updateFoto(event.target.files?.[0] || null)}
            className="w-full text-sm text-text/70 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:text-primary"
          />
        </label>

        {fotoPreview ? (
          <div className="mt-4 flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-primary/10 bg-white">
              <img
                src={fotoPreview}
                alt="preview de la foto"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => updateFoto(null)}
              className="rounded-lg border border-primary/20 px-3 py-2 text-sm text-primary transition hover:bg-white"
            >
              quitar foto
            </button>
          </div>
        ) : null}
      </div>

      {submitted ? (
        <div className="rounded-xl border border-primary/10 bg-[#fffaf4] px-4 py-3 text-sm leading-relaxed text-text/70">
          gracias por compartir tu experiencia.
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
