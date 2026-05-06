"use client";

import Link from "next/link";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import TestimonioAdminCard from "@/components/admin/TestimonioAdminCard";
import { adminTestimonios } from "@/data/adminTestimonios";

export default function AdminTestimoniosPage() {
  const [testimonios, setTestimonios] = useState(adminTestimonios);

  const toggleEstado = (id) => {
    setTestimonios((prev) =>
      prev.map((testimonio) =>
        testimonio.id === id
          ? {
              ...testimonio,
              estado: testimonio.estado === "activo" ? "inactivo" : "activo",
            }
          : testimonio
      )
    );
  };

  const eliminar = (id) => {
    setTestimonios((prev) => prev.filter((testimonio) => testimonio.id !== id));
  };

  return (
    <AdminLayout
      titulo="gestionar testimonios"
      descripcion="administrá las reseñas de clientes y definí cuáles quedan activas o visibles en la home."
      acciones={
        <Link
          href="/admin/testimonios/nuevo"
          className="rounded-xl bg-primary px-4 py-3 text-sm text-white transition hover:opacity-85"
        >
          nuevo testimonio
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {testimonios.map((testimonio) => (
          <TestimonioAdminCard
            key={testimonio.id}
            testimonio={testimonio}
            onToggleEstado={toggleEstado}
            onEliminar={eliminar}
          />
        ))}
      </div>
    </AdminLayout>
  );
}
