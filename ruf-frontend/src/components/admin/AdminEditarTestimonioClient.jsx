"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TestimonioForm from "@/components/admin/TestimonioForm";
import {
  getAdminTestimonioById,
  updateTestimonio,
} from "@/services/testimonios";

export default function AdminEditarTestimonioClient({ id }) {
  const router = useRouter();
  const [testimonio, setTestimonio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let activo = true;

    getAdminTestimonioById(id)
      .then((data) => {
        if (!activo) return;
        setTestimonio(data);
        setError(false);
      })
      .catch(() => {
        if (!activo) return;
        setTestimonio(null);
        setError(true);
      })
      .finally(() => {
        if (!activo) return;
        setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, [id]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await updateTestimonio(id, data);
      alert("testimonio actualizado");
      router.push("/admin/testimonios");
      router.refresh();
    } catch {
      alert("no pudimos actualizar el testimonio");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-8 text-sm text-text/60">
        cargando testimonio...
      </div>
    );
  }

  if (error || !testimonio) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-8 text-sm text-text/60">
        no pudimos cargar el testimonio
      </div>
    );
  }

  return (
    <TestimonioForm
      initialData={testimonio}
      mode="editar"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
