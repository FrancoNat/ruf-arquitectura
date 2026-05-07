import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ProyectoAdminCard from "@/components/admin/ProyectoAdminCard";
import { adminProyectos } from "@/data/adminProyectos";

export default function AdminProyectosPage() {
  return (
    <AdminLayout
      titulo="gestionar proyectos"
      descripcion="listado de proyectos mock para simular el flujo de administracion del contenido."
      acciones={
        <Link
          href="/admin/proyectos/nuevo"
          className="rounded-xl bg-primary px-4 py-3 text-sm text-white transition hover:opacity-85"
        >
          nuevo proyecto
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {adminProyectos.map((proyecto) => (
          <ProyectoAdminCard key={proyecto.id} proyecto={proyecto} />
        ))}
      </div>
    </AdminLayout>
  );
}
