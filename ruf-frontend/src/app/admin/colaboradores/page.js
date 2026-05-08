import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ColaboradoresClient from "@/components/admin/ColaboradoresClient";

export default function AdminColaboradoresPage() {
  return (
    <AdminLayout
      titulo="colaboradores"
      descripcion="gestioná usuarios del panel admin, roles y estado de acceso."
      acciones={
        <Link
          href="/admin/colaboradores/nuevo"
          className="rounded-xl bg-primary px-4 py-3 text-sm text-white transition hover:opacity-85"
        >
          nuevo colaborador
        </Link>
      }
    >
      <ColaboradoresClient />
    </AdminLayout>
  );
}
