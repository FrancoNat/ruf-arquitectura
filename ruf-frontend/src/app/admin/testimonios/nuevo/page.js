import AdminLayout from "@/components/admin/AdminLayout";
import AdminNuevoTestimonioClient from "@/components/admin/AdminNuevoTestimonioClient";

export default function AdminNuevoTestimonioPage() {
  return (
    <AdminLayout
      titulo="nuevo testimonio"
      descripcion="cargá una nueva reseña con foto, estrellas, estado y visibilidad en home."
    >
      <AdminNuevoTestimonioClient />
    </AdminLayout>
  );
}
