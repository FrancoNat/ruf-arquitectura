import AdminLayout from "@/components/admin/AdminLayout";
import AdminNuevoProyectoClient from "@/components/admin/AdminNuevoProyectoClient";

export default function AdminNuevoProyectoPage() {
  return (
    <AdminLayout
      titulo="nuevo proyecto"
      descripcion="completa la informacion principal del proyecto y guardalo en la api local."
    >
      <AdminNuevoProyectoClient />
    </AdminLayout>
  );
}
