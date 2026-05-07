import Image from "next/image";
import Link from "next/link";

export default function QuienesSomos() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
          <Image
            src="/images/equipo/equipo ruf.png"
            alt="equipo de rüf arquitectura en buenos aires"
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="text-3xl text-primary mb-6">quiénes somos</h2>

          <p className="text-text mb-6 leading-relaxed">
            somos un estudio de arquitectura en buenos aires, argentina,
            enfocado en diseñar espacios funcionales, estéticos y pensados para
            quienes los habitan.
          </p>

          <p className="text-text mb-8 leading-relaxed">
            trabajamos cada proyecto de forma personalizada, con atención online
            para todo el país, desarrollando arquitectura, interiorismo y
            muebles a medida desde la idea inicial hasta su ejecución.
          </p>

          <Link
            href="/quienes-somos"
            className="inline-block border border-primary px-6 py-3 rounded-lg text-primary hover:bg-primary hover:text-white transition"
          >
            conocenos más
          </Link>
        </div>
      </div>
    </section>
  );
}
