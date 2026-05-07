import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTestimoniosClient from "@/components/admin/AdminTestimoniosClient";

export default function AdminTestimoniosPage() {
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
      <AdminTestimoniosClient />
    </AdminLayout>
  );
}
