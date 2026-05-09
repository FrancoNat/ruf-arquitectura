"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TestimonioForm from "@/components/admin/TestimonioForm";
import { useNotifications } from "@/components/ui/NotificationProvider";
import { createTestimonio } from "@/services/testimonios";

export default function AdminNuevoTestimonioClient() {
  const router = useRouter();
  const { error: notifyError, success } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await createTestimonio(data);
      success("testimonio guardado");
      router.push("/admin/testimonios");
      router.refresh();
    } catch {
      notifyError("no pudimos guardar el testimonio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TestimonioForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
  );
}
