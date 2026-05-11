import Link from "next/link";
import Navbar from "../../components/Navbar";

const servicios = [
  {
    titulo: "anteproyecto y proyecto desde cero",
    descripcion:
      "desarrollo integral de tu vivienda o espacio, desde la primera idea hasta su definición completa.",
  },
  {
    titulo: "reformas",
    descripcion:
      "análisis del espacio existente y propuesta de renovación y optimización acorde a tus necesidades.",
  },
  {
    titulo: "desarrollo de propuesta",
    descripcion:
      "presentación del proyecto mediante planos y visualizaciones, para que puedas comprender y definir cada aspecto del diseño.",
  },
  {
    titulo: "documentación técnica",
    descripcion:
      "elaboración de planos y detalles necesarios para que puedas materializar tu proyecto.",
  },
  {
    titulo: "gestión integral de obra",
    descripcion:
      "coordinación de proveedores, gremios y seguimiento de ejecución para que el proyecto se materialice según lo previsto.",
  },
];

export default function ArquitecturaPage() {
  return (
    <>
      <Navbar alwaysVisible />

      <main className="bg-background pb-16 pt-36 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <section className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary/60">
                servicios
              </p>
              <h1 className="mt-4 text-4xl text-primary sm:text-5xl">
                arquitectura
              </h1>
            </div>

            <p className="max-w-3xl text-lg leading-relaxed text-text/75 sm:text-xl">
              diseñamos y desarrollamos proyectos de arquitectura adaptados a
              tu forma de habitar, acompañándote de principio a fin.
            </p>
          </section>

          <section className="mt-14 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
              <div>
                <h2 className="text-2xl text-primary">¿qué ofrecemos?</h2>
                <p className="mt-4 text-sm leading-relaxed text-text/60">
                  cada etapa se define según el alcance real del proyecto y las
                  decisiones que necesita el espacio.
                </p>
              </div>

              <div className="divide-y divide-black/5">
                {servicios.map((servicio, index) => (
                  <article
                    key={servicio.titulo}
                    className="grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[52px_1fr]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-sm text-primary">
                      {index + 1}
                    </span>

                    <div>
                      <h3 className="text-base font-semibold text-primary">
                        {servicio.titulo}
                      </h3>
                      <p className="mt-2 leading-relaxed text-text/70">
                        {servicio.descripcion}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-primary/10 bg-[#fffaf4] p-5 shadow-sm sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-3xl space-y-3 leading-relaxed text-text/75">
                <p>
                  este servicio se cotiza de forma personalizada según el
                  alcance del proyecto.
                </p>
                <p>
                  para más información podés comunicarte con nosotras a través
                  de nuestros medios de contacto.
                </p>
              </div>

              <Link
                href="/agenda"
                className="inline-flex w-fit rounded-full bg-primary px-4 py-2 text-sm text-white transition hover:opacity-85 sm:rounded-lg sm:px-6 sm:py-3 sm:text-base"
              >
                agendar reunión
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
