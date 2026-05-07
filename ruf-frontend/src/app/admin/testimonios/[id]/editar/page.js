import AdminLayout from "@/components/admin/AdminLayout";
import AdminEditarTestimonioClient from "@/components/admin/AdminEditarTestimonioClient";

export default async function AdminEditarTestimonioPage({ params }) {
  const { id } = await params;

  return (
    <AdminLayout
      titulo="editar testimonio"
      descripcion="actualizá el contenido del testimonio y definí si debe seguir visible en el home."
    >
      <AdminEditarTestimonioClient id={id} />
    </AdminLayout>
  );
}
