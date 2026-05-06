import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProyectoForm from "@/components/admin/ProyectoForm";
import { adminProyectos } from "@/data/adminProyectos";

export default async function AdminEditarProyectoPage({ params }) {
  const { id } = await params;
  const proyecto = adminProyectos.find((item) => item.id === id);

  if (!proyecto) {
    notFound();
  }

  return (
    <AdminLayout
      titulo="editar proyecto"
      descripcion="modificá los datos mock del proyecto, reorganizá la galería y definí la imagen principal."
    >
      <ProyectoForm initialData={proyecto} mode="editar" />
    </AdminLayout>
  );
}
