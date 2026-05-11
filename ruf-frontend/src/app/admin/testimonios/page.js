import AdminLayout from "@/components/admin/AdminLayout";
import AdminTestimoniosClient from "@/components/admin/AdminTestimoniosClient";

export default function AdminTestimoniosPage() {
  return (
    <AdminLayout
      titulo="gestionar testimonios"
      descripcion="administrá las reseñas de clientes y definí cuáles quedan activas o visibles en la home."
    >
      <AdminTestimoniosClient />
    </AdminLayout>
  );
}
