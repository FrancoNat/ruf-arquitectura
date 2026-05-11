import Navbar from "@/components/Navbar";
import PublicTestimonioForm from "@/components/testimonios/PublicTestimonioForm";

export const metadata = {
  title: "compartir testimonio | rüf arquitectura",
  description:
    "Formulario privado para compartir una experiencia con rüf arquitectura.",
};

export default function TestimonioFormularioPage() {
  return (
    <>
      <Navbar alwaysVisible />

      <main className="bg-background pb-16 pt-36 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <section className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary/60">
                formulario privado
              </p>
              <h1 className="mt-4 text-4xl text-primary sm:text-5xl">
                compartir testimonio
              </h1>
            </div>

            <p className="max-w-3xl text-lg leading-relaxed text-text/75 sm:text-xl">
              queremos conocer cómo fue tu experiencia con rüf. Tu testimonio
              queda guardado para revisión antes de aparecer en el sitio.
            </p>
          </section>

          <section className="mt-14 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
              <div>
                <h2 className="text-2xl text-primary">tu experiencia</h2>
                <p className="mt-4 text-sm leading-relaxed text-text/60">
                  completá los datos principales y contanos qué servicio hicimos
                  juntas.
                </p>
              </div>

              <PublicTestimonioForm />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
