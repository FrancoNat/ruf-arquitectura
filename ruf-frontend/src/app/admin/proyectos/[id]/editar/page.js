import AdminLayout from "@/components/admin/AdminLayout";
import AdminEditarProyectoClient from "@/components/admin/AdminEditarProyectoClient";

export default async function AdminEditarProyectoPage({ params }) {
  const { id } = await params;

  return (
    <AdminLayout
      titulo="editar proyecto"
      descripcion="modificá los datos del proyecto, reorganizá la galería y definí la imagen principal."
    >
      <AdminEditarProyectoClient id={id} />
    </AdminLayout>
  );
}
