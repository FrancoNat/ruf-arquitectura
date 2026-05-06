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

        <div className="flex w-full max-w-sm flex-col gap-3 sm:mx-auto sm:w-auto sm:max-w-none sm:flex-row sm:justify-center">
          <a
            href="#proyectos"
            className="rounded-lg bg-primary px-6 py-3 text-center transition hover:opacity-80"
          >
            ver proyectos
          </a>

          <a
            href="/agenda"
            className="rounded-lg border border-white px-6 py-3 text-center transition hover:bg-white hover:text-black"
          >
            agendar reunión
          </a>
        </div>
      </div>
    </section>
  );
}
