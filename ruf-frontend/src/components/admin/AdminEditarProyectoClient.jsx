"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProyectoForm from "@/components/admin/ProyectoForm";
import { useNotifications } from "@/components/ui/NotificationProvider";
import {
  getAdminProyectoById,
  updateProyecto,
} from "@/services/proyectos";

export default function AdminEditarProyectoClient({ id }) {
  const router = useRouter();
  const { error: notifyError, success } = useNotifications();
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let activo = true;

    getAdminProyectoById(id)
      .then((data) => {
        if (!activo) return;
        setProyecto(data);
        setError(false);
      })
      .catch(() => {
        if (!activo) return;
        setProyecto(null);
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
      await updateProyecto(id, data);
      success("proyecto actualizado");
      router.push("/admin/proyectos");
      router.refresh();
    } catch {
      notifyError("no pudimos actualizar el proyecto");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-8 text-sm text-text/60">
        cargando proyecto...
      </div>
    );
  }

  if (error || !proyecto) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-8 text-sm text-text/60">
        no pudimos cargar el proyecto
      </div>
    );
  }

  return (
    <ProyectoForm
      initialData={proyecto}
      mode="editar"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
