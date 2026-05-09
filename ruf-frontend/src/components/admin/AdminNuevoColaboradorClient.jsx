"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ColaboradorForm from "@/components/admin/ColaboradorForm";
import { useNotifications } from "@/components/ui/NotificationProvider";
import { getUsuarioActual } from "@/services/auth";
import { createUsuario } from "@/services/usuarios";

export default function AdminNuevoColaboradorClient() {
  const router = useRouter();
  const { error: notifyError, success } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const usuarioActual = getUsuarioActual();

  if (usuarioActual?.rol !== "admin") {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-text/70 shadow-sm">
        no tenés permisos para crear colaboradores
      </div>
    );
  }

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await createUsuario(data);
      success("colaborador guardado");
      router.push("/admin/colaboradores");
    } catch (err) {
      notifyError(err.data?.error || "no pudimos guardar el colaborador");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <ColaboradorForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
}
