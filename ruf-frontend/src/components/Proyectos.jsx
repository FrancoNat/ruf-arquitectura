import Link from "next/link";
import ProyectosDestacadosCarousel from "@/components/proyectos/ProyectosDestacadosCarousel";
import { getProyectosDestacados } from "@/services/proyectos";

export default async function Proyectos() {
  let proyectos = [];
  let error = false;

  try {
    proyectos = await getProyectosDestacados();
  } catch {
    error = true;
  }

  return (
    <section id="proyectos" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-2 text-3xl text-primary">proyectos destacados</h2>

            <p className="text-gray-500">
              cada proyecto es único, diseñado a medida
            </p>
          </div>

          <Link
            href="/proyectos"
            className="w-full rounded-lg border border-primary px-5 py-3 text-center text-primary transition hover:bg-primary hover:text-white sm:w-auto sm:shrink-0"
          >
            ver todos los proyectos
          </Link>
        </div>

        {error ? (
          <div className="rounded-xl border border-dashed border-black/10 bg-white px-4 py-6 text-sm text-text/60">
            no pudimos cargar los proyectos
          </div>
        ) : (
          <ProyectosDestacadosCarousel proyectos={proyectos} />
        )}
      </div>
    </section>
  );
}
