import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import TestimonioForm from "@/components/admin/TestimonioForm";
import { adminTestimonios } from "@/data/adminTestimonios";

export default async function AdminEditarTestimonioPage({ params }) {
  const { id } = await params;
  const testimonio = adminTestimonios.find((item) => item.id === id);

  if (!testimonio) {
    notFound();
  }

  return (
    <AdminLayout
      titulo="editar testimonio"
      descripcion="actualizá el contenido del testimonio y definí si debe seguir visible en el home."
    >
      <TestimonioForm initialData={testimonio} mode="editar" />
    </AdminLayout>
  );
}
