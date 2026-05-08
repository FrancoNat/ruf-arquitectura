import AdminLayout from "@/components/admin/AdminLayout";
import AdminNuevoColaboradorClient from "@/components/admin/AdminNuevoColaboradorClient";

export default function AdminNuevoColaboradorPage() {
  return (
    <AdminLayout
      titulo="nuevo colaborador"
      descripcion="creá un usuario para acceder al panel admin."
    >
      <AdminNuevoColaboradorClient />
    </AdminLayout>
  );
}
