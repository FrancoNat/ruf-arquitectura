import AdminLayout from "@/components/admin/AdminLayout";
import TestimonioForm from "@/components/admin/TestimonioForm";

export default function AdminNuevoTestimonioPage() {
  return (
    <AdminLayout
      titulo="nuevo testimonio"
      descripcion="cargá una nueva reseña con foto, estrellas, estado y visibilidad en home."
    >
      <TestimonioForm mode="nuevo" />
    </AdminLayout>
  );
}
