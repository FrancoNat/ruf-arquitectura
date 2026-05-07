"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TestimonioForm from "@/components/admin/TestimonioForm";
import { createTestimonio } from "@/services/testimonios";

export default function AdminNuevoTestimonioClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await createTestimonio(data);
      alert("testimonio guardado");
      router.push("/admin/testimonios");
      router.refresh();
    } catch {
      alert("no pudimos guardar el testimonio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TestimonioForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
  );
}
