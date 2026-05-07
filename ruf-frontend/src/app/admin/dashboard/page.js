import Image from "next/image";
import Link from "next/link";
import AdminCard from "@/components/admin/AdminCard";
import CategoriaManager from "@/components/admin/CategoriaManager";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminProyectos } from "@/data/adminProyectos";
import { adminTestimonios } from "@/data/adminTestimonios";
import { reunionesMock } from "@/data/agendaMock";

export default function AdminDashboardPage() {
  const proyectos = adminProyectos.length;
  const resenas = adminTestimonios.length;
  const reuniones = reunionesMock.length;

  return (
    <AdminLayout
      titulo="panel admin"
      descripcion="un panel simple para empezar a gestionar el contenido del sitio con datos locales y una estructura clara."
      topContent={
        <div className="rounded-2xl border border-black/5 bg-white px-6 py-4 shadow-sm">
          <Image
            src="/images/logos/Logo marron png.png"
            alt="rüf arquitectura"
            width={180}
            height={72}
            className="mx-auto h-12 w-auto"
          />
        </div>
      }
      acciones={
        <>
          <Link
            href="/admin/proyectos"
            className="rounded-xl bg-primary px-4 py-3 text-sm text-white transition hover:opacity-85"
          >
            gestionar proyectos
          </Link>
          <Link
            href="/admin/proyectos/nuevo"
            className="rounded-xl border border-primary/15 px-4 py-3 text-sm text-primary transition hover:bg-background"
          >
            nuevo proyecto
          </Link>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AdminCard
          titulo="proyectos"
          valor={String(proyectos)}
          descripcion="proyectos cargados en el panel admin."
        />
        <AdminCard
          titulo="reseñas"
          valor={String(resenas)}
          descripcion="testimonios disponibles para mostrar en el sitio."
        />
        <AdminCard
          titulo="reuniones"
          valor={String(reuniones)}
          descripcion="solicitudes recientes generadas desde agenda."
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <AdminCard
          titulo="gestionar proyectos"
          descripcion="revisa, edita o elimina los proyectos publicados y en borrador."
        >
          <Link
            href="/admin/proyectos"
            className="inline-flex rounded-xl bg-primary px-4 py-3 text-sm text-white transition hover:opacity-85"
          >
            abrir listado
          </Link>
        </AdminCard>

        <AdminCard
          titulo="nuevo proyecto"
          descripcion="carga un proyecto nuevo con informacion general e imagen principal."
        >
          <Link
            href="/admin/proyectos/nuevo"
            className="inline-flex rounded-xl bg-primary px-4 py-3 text-sm text-white transition hover:opacity-85"
          >
            crear proyecto
          </Link>
        </AdminCard>

        <AdminCard
          titulo="gestionar testimonios"
          descripcion="crea, edita y define que reseñas se muestran en la home."
        >
          <Link
            href="/admin/testimonios"
            className="inline-flex rounded-xl bg-primary px-4 py-3 text-sm text-white transition hover:opacity-85"
          >
            abrir testimonios
          </Link>
        </AdminCard>

        <AdminCard
          titulo="agenda"
          descripcion="controla reuniones, bloqueos y disponibilidad por día."
        >
          <Link
            href="/admin/agenda"
            className="inline-flex rounded-xl bg-primary px-4 py-3 text-sm text-white transition hover:opacity-85"
          >
            abrir agenda
          </Link>
        </AdminCard>

        <AdminCard
          titulo="volver al sitio"
          descripcion="sal del panel y revisa el frontend publico de rüf arquitectura."
        >
          <Link
            href="/"
            className="inline-flex rounded-xl bg-primary px-4 py-3 text-sm text-white transition hover:opacity-85"
          >
            ir al home
          </Link>
        </AdminCard>
      </div>

      <CategoriaManager />
    </AdminLayout>
  );
}
