import TestimoniosCarousel from "@/components/testimonios/TestimoniosCarousel";
import { getTestimoniosHome } from "@/services/testimonios";

export default async function Testimonios() {
  let testimonios = [];
  let error = false;

  try {
    testimonios = await getTestimoniosHome();
  } catch {
    error = true;
  }

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-12 text-3xl text-primary">
          lo que dicen nuestros clientes
        </h2>

        {error ? (
          <div className="rounded-xl border border-dashed border-black/10 bg-white px-4 py-6 text-sm text-text/60">
            no pudimos cargar los testimonios
          </div>
        ) : testimonios.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/10 bg-white px-4 py-6 text-sm text-text/60">
            todavía no hay testimonios disponibles
          </div>
        ) : (
          <TestimoniosCarousel testimonios={testimonios} />
        )}
      </div>
    </section>
  );
}
