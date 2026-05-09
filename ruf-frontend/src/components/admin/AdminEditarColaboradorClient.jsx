"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ColaboradorForm from "@/components/admin/ColaboradorForm";
import { useNotifications } from "@/components/ui/NotificationProvider";
import { getUsuarioActual } from "@/services/auth";
import { getUsuarios, updateUsuario } from "@/services/usuarios";

export default function AdminEditarColaboradorClient({ id }) {
  const router = useRouter();
  const { error: notifyError, success } = useNotifications();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const usuarioActual = getUsuarioActual();

  useEffect(() => {
    let activo = true;

    getUsuarios()
      .then((usuarios) => {
        if (!activo) return;
        const encontrado = usuarios.find((item) => item.id === id);
        if (!encontrado) {
          setError("no encontramos el usuario");
          return;
        }

        setUsuario(encontrado);
      })
      .catch((err) => {
        if (activo) {
          setError(err.message || "no pudimos cargar el usuario");
        }
      })
      .finally(() => {
        if (activo) {
          setLoading(false);
        }
      });

    return () => {
      activo = false;
    };
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await updateUsuario(id, data);
      success("colaborador actualizado");
      router.push("/admin/colaboradores");
    } catch (err) {
      notifyError(err.data?.error || "no pudimos actualizar el colaborador");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (usuarioActual?.rol !== "admin") {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-text/70 shadow-sm">
        no tenés permisos para editar colaboradores
      </div>
    );
  }

  if (loading) {
    return <p className="text-sm text-text/60">cargando colaborador...</p>;
  }

  if (error) {
    return <p className="text-sm text-primary">{error}</p>;
  }

  return (
    <ColaboradorForm
      initialData={usuario}
      mode="editar"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
