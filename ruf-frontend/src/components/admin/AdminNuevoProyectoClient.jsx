"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ProyectoForm from "@/components/admin/ProyectoForm";
import { useNotifications } from "@/components/ui/NotificationProvider";
import { createProyecto } from "@/services/proyectos";

export default function AdminNuevoProyectoClient() {
  const router = useRouter();
  const { error: notifyError, success } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await createProyecto(data);
      success("proyecto guardado");
      router.push("/admin/proyectos");
      router.refresh();
    } catch {
      notifyError("no pudimos guardar el proyecto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <ProyectoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
}
