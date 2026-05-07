import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminProyectosClient from "@/components/admin/AdminProyectosClient";

export default function AdminProyectosPage() {
  return (
    <AdminLayout
      titulo="gestionar proyectos"
      descripcion="listado de proyectos cargados desde la api local."
      acciones={
        <Link
          href="/admin/proyectos/nuevo"
          className="rounded-xl bg-primary px-4 py-3 text-sm text-white transition hover:opacity-85"
        >
          nuevo proyecto
        </Link>
      }
    >
      <AdminProyectosClient />
    </AdminLayout>
  );
}
