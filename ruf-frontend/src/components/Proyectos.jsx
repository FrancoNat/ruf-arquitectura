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
        <div className="mb-8 sm:mb-10">
          <div>
            <h2 className="mb-2 text-3xl text-primary">proyectos destacados</h2>

            <p className="text-gray-500">
              cada proyecto es único, diseñado a medida
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-dashed border-black/10 bg-white px-4 py-6 text-sm text-text/60">
            no pudimos cargar los proyectos
          </div>
        ) : (
          <ProyectosDestacadosCarousel proyectos={proyectos} />
        )}

        <div className="mt-2 flex justify-center sm:mt-4">
          <Link
            href="/proyectos"
            className="inline-flex rounded-full border border-primary/25 px-4 py-2 text-sm text-primary transition hover:bg-primary hover:text-white sm:px-5 sm:py-3"
          >
            ver todos los proyectos
          </Link>
        </div>
      </div>
    </section>
  );
}
