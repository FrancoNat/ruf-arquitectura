"use client";

import { useEffect, useState } from "react";
import TestimonioAdminCard from "@/components/admin/TestimonioAdminCard";
import {
  deleteTestimonio,
  getAdminTestimonios,
  updateTestimonio,
} from "@/services/testimonios";

export default function AdminTestimoniosClient() {
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let activo = true;

    getAdminTestimonios()
      .then((data) => {
        if (!activo) return;
        setTestimonios(data);
        setError(false);
      })
      .catch(() => {
        if (!activo) return;
        setTestimonios([]);
        setError(true);
      })
      .finally(() => {
        if (!activo) return;
        setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const toggleEstado = async (id) => {
    const testimonio = testimonios.find((item) => item.id === id);

    if (!testimonio) {
      return;
    }

    const estado = testimonio.estado === "activo" ? "inactivo" : "activo";
    setUpdatingId(id);

    try {
      const actualizado = await updateTestimonio(id, {
        ...testimonio,
        estado,
      });

      setTestimonios((prev) =>
        prev.map((item) => (item.id === id ? actualizado : item))
      );
    } catch {
      alert("no pudimos actualizar el testimonio");
    } finally {
      setUpdatingId("");
    }
  };

  const eliminar = async (id) => {
    const testimonio = testimonios.find((item) => item.id === id);
    const confirmar = window.confirm(
      `¿eliminar ${testimonio?.nombre || "este testimonio"}?`
    );

    if (!confirmar) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteTestimonio(id);
      setTestimonios((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("no pudimos eliminar el testimonio");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-8 text-sm text-text/60">
        cargando testimonios...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-8 text-sm text-text/60">
        no pudimos cargar los testimonios
      </div>
    );
  }

  if (testimonios.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-8 text-sm text-text/60">
        todavía no hay testimonios cargados.
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {testimonios.map((testimonio) => (
        <TestimonioAdminCard
          key={testimonio.id}
          testimonio={testimonio}
          updating={updatingId === testimonio.id}
          deleting={deletingId === testimonio.id}
          onToggleEstado={toggleEstado}
          onEliminar={eliminar}
        />
      ))}
    </div>
  );
}
