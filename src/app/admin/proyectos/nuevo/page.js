import ProyectoForm from "@/components/admin/ProyectoForm";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminNuevoProyectoPage() {
  return (
    <AdminLayout
      titulo="nuevo proyecto"
      descripcion="completa la informacion principal del proyecto. por ahora el guardado es simulado para practicar la estructura del panel."
    >
      <ProyectoForm />
    </AdminLayout>
  );
}
