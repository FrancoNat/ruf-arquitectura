import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen">
      <Image
        src="/images/proyectos/casa interior moderno elegante.jpeg"
        alt="interior moderno diseñado por rüf arquitectura"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-10 text-center text-white sm:px-6 md:pt-24">
        <h1 className="mb-4 text-4xl font-light leading-tight sm:text-5xl md:text-7xl">
          espacios que se viven
        </h1>

        <p className="mb-8 max-w-2xl text-base text-white/80 sm:text-lg">
          estudio de arquitectura en buenos aires con atención online en
          argentina. desarrollamos arquitectura, interiorismo y muebles a
          medida.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="#proyectos"
            className="rounded-full bg-primary px-5 py-2.5 text-sm text-white transition hover:opacity-80 sm:rounded-lg sm:px-6 sm:py-3 sm:text-base"
          >
            ver proyectos
          </a>

          <a
            href="/agenda"
            className="rounded-full border border-white/80 px-5 py-2.5 text-sm text-white transition hover:bg-white hover:text-black sm:rounded-lg sm:px-6 sm:py-3 sm:text-base"
          >
            agendar reunión
          </a>
        </div>
      </div>
    </section>
  );
}
