import Navbar from "../../components/Navbar";
import Link from "next/link";
import ProyectosGrid from "@/components/proyectos/ProyectosGrid";
import { getProyectos } from "@/services/proyectos";

export const dynamic = "force-dynamic";

export default async function ProyectosPage() {
  let proyectos = [];
  let error = false;

  try {
    proyectos = await getProyectos();
  } catch {
    error = true;
  }

  return (
    <>
      <Navbar alwaysVisible />

      <main className="bg-background pb-16 pt-36 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="mb-10 text-3xl text-primary sm:mb-12 sm:text-4xl">
            proyectos
          </h1>

          {error ? (
            <div className="mt-8 rounded-xl border border-dashed border-black/10 bg-white px-4 py-6 text-sm text-text/60">
              no pudimos cargar los proyectos
            </div>
          ) : (
            <ProyectosGrid proyectos={proyectos} />
          )}
          
          <div className="mt-10">
            <Link
              href="/agenda"
              className="inline-flex rounded-lg border border-primary px-5 py-3 text-primary transition hover:bg-primary hover:text-white"
            >
              agendar reunión
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
