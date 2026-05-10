"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProyectoForm from "@/components/admin/ProyectoForm";
import { useNotifications } from "@/components/ui/NotificationProvider";
import {
  deleteProyecto,
  getAdminProyectoById,
  updateProyecto,
} from "@/services/proyectos";

export default function AdminEditarProyectoClient({ id }) {
  const router = useRouter();
  const { confirmDialog, error: notifyError, success } = useNotifications();
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    const confirmar = await confirmDialog({
      title: "eliminar proyecto",
      message: `¿eliminar ${proyecto?.titulo || "este proyecto"}?`,
      confirmLabel: "eliminar",
    });

    if (!confirmar) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteProyecto(id);
      success("proyecto eliminado");
      router.push("/admin/proyectos");
      router.refresh();
    } catch {
      notifyError("no pudimos eliminar el proyecto");
    } finally {
      setIsDeleting(false);
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
      secondaryAction={
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isSubmitting}
          className="rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl sm:px-5 sm:py-3"
        >
          {isDeleting ? "eliminando..." : "eliminar proyecto"}
        </button>
      }
    />
  );
}
