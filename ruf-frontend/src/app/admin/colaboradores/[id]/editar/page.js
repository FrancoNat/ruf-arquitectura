import AdminLayout from "@/components/admin/AdminLayout";
import AdminEditarColaboradorClient from "@/components/admin/AdminEditarColaboradorClient";

export default async function AdminEditarColaboradorPage({ params }) {
  const { id } = await params;

  return (
    <AdminLayout
      titulo="editar colaborador"
      descripcion="actualizá datos, rol, estado o contraseña de acceso."
    >
      <AdminEditarColaboradorClient id={id} />
    </AdminLayout>
  );
}
