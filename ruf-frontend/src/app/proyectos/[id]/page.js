import Navbar from "../../../components/Navbar";
import ProyectoDetalleClient from "@/components/proyectos/ProyectoDetalleClient";
import { getProyectoById } from "@/services/proyectos";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProyectoDetalle({ params }) {
  const { id } = await params;
  let proyecto = null;
  let error = false;

  try {
    proyecto = await getProyectoById(id);
  } catch (err) {
    if (err.message === "error api: 404") {
      notFound();
    }

    error = true;
  }

  return (
    <>
      <Navbar alwaysVisible />

      <main className="bg-background pb-16 pt-36 sm:pb-20 sm:pt-32">
        {error ? (
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="rounded-xl border border-dashed border-black/10 bg-white px-4 py-6 text-sm text-text/60">
              no pudimos cargar los proyectos
            </div>
          </div>
        ) : (
          <ProyectoDetalleClient proyecto={proyecto} />
        )}
      </main>
    </>
  );
}
