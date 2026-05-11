import Link from "next/link";
import AdminCard from "@/components/admin/AdminCard";
import CategoriaManager from "@/components/admin/CategoriaManager";
import DashboardStats from "@/components/admin/DashboardStats";
import AdminLayout from "@/components/admin/AdminLayout";
import TestimonioShareActions from "@/components/admin/TestimonioShareActions";

const primaryActionClass =
  "inline-flex w-fit rounded-full bg-primary px-3 py-2 text-xs text-white transition hover:opacity-85 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm";

const secondaryActionClass =
  "rounded-full border border-primary/15 px-3 py-2 text-xs text-primary transition hover:bg-background sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm";

export default function AdminDashboardPage() {
  return (
    <AdminLayout
      titulo="panel admin"
      descripcion="un panel simple para empezar a gestionar el contenido del sitio con datos locales y una estructura clara."
      acciones={
        <>
          <Link
            href="/admin/proyectos"
            className={primaryActionClass}
          >
            gestionar proyectos
          </Link>
          <Link
            href="/admin/proyectos/nuevo"
            className={secondaryActionClass}
          >
            nuevo proyecto
          </Link>
          <Link
            href="/admin/colaboradores"
            className={secondaryActionClass}
          >
            colaboradores
          </Link>
        </>
      }
    >
      <DashboardStats />

      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
        <AdminCard
          titulo="gestionar proyectos"
          descripcion="revisa, edita o elimina los proyectos publicados y en borrador."
          className="min-w-0 p-3 sm:p-5"
        >
          <Link
            href="/admin/proyectos"
            className={primaryActionClass}
          >
            abrir listado
          </Link>
        </AdminCard>

        <AdminCard
          titulo="nuevo proyecto"
          descripcion="carga un proyecto nuevo con informacion general e imagen principal."
          className="min-w-0 p-3 sm:p-5"
        >
          <Link
            href="/admin/proyectos/nuevo"
            className={primaryActionClass}
          >
            crear proyecto
          </Link>
        </AdminCard>

        <AdminCard
          titulo="gestionar testimonios"
          descripcion="crea, edita y define que reseñas se muestran en la home."
          className="min-w-0 p-3 sm:p-5"
        >
          <Link
            href="/admin/testimonios"
            className={primaryActionClass}
          >
            abrir testimonios
          </Link>
        </AdminCard>

        <AdminCard
          titulo="formulario de testimonios"
          descripcion="abrí el formulario privado para compartirlo con clientes."
          className="min-w-0 p-3 sm:p-5"
        >
          <TestimonioShareActions primaryActionClass={primaryActionClass} />
        </AdminCard>

        <AdminCard
          titulo="agenda"
          descripcion="controla reuniones, bloqueos y disponibilidad por día."
          className="min-w-0 p-3 sm:p-5"
        >
          <Link
            href="/admin/agenda"
            className={primaryActionClass}
          >
            abrir agenda
          </Link>
        </AdminCard>

        <AdminCard
          titulo="colaboradores"
          descripcion="crea usuarios, ajusta roles y desactiva accesos del panel."
          className="min-w-0 p-3 sm:p-5"
        >
          <Link
            href="/admin/colaboradores"
            className={primaryActionClass}
          >
            gestionar colaboradores
          </Link>
        </AdminCard>

        <AdminCard
          titulo="volver al sitio"
          descripcion="sal del panel de administrador y volvé al sitio."
          className="min-w-0 p-3 sm:p-5"
        >
          <Link
            href="/"
            className={primaryActionClass}
          >
            ir al home
          </Link>
        </AdminCard>
      </div>

      <CategoriaManager />
    </AdminLayout>
  );
}
