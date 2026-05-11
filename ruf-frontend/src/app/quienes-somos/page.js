import Image from "next/image";
import Navbar from "../../components/Navbar";

export default function QuienesSomosPage() {
  return (
    <>
      <Navbar alwaysVisible />

      <main className="bg-background pb-16 pt-36 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="mb-10 text-center text-3xl text-primary sm:text-4xl">
            quiénes somos
          </h1>

          <div className="mb-20 grid items-start gap-12 md:grid-cols-2">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="relative h-56 w-56 overflow-hidden rounded-full sm:h-72 sm:w-72">
                <Image
                  src="/images/equipo/Trinidad.jpeg"
                  alt="arquitecta trinidad garcia bottazzo de rüf arquitectura"
                  fill
                  sizes="(max-width: 639px) 224px, 288px"
                  className="object-cover"
                />
              </div>

              <h2 className="text-xl text-primary">
                arq. trinidad garcia bottazzo
              </h2>
            </div>

            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="relative h-56 w-56 overflow-hidden rounded-full sm:h-72 sm:w-72">
                <Image
                  src="/images/equipo/Camila.jpeg"
                  alt="arquitecta camila belén bogado de rüf arquitectura"
                  fill
                  sizes="(max-width: 639px) 224px, 288px"
                  className="object-cover"
                />
              </div>

              <h2 className="text-xl text-primary">arq. camila belén bogado</h2>
            </div>
          </div>

          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <p className="text-lg leading-relaxed text-text">
              <strong>
                somos trinidad y camila, arquitectas detrás de rüf.
              </strong>
            </p>

            <p className="leading-relaxed text-text">
              <em>rüf</em>, en lengua mapuche, significa{" "}
              <strong>verdadero, real</strong>. trabajamos desde esa idea
              entendiendo la arquitectura a partir del habitar. cada proyecto
              parte de como se vive un espacio, no solo de como se ve.
            </p>

            <p className="leading-relaxed text-text">
              un mismo espacio puede responder de maneras distintas según quién
              lo habite. por eso, buscamos respuestas simples, bien pensadas,
              que puedan sostenerse en el tiempo y que el proyecto se construya
              a partir de las necesidades reales de cada persona, del espacio y
              de sus posibilidades.
            </p>

            <p className="leading-relaxed text-text">
              desarrollamos proyectos de arquitectura e interiorismo,
              acompañando cada proceso de forma personalizada de principio a fin
              desde buenos aires, argentina, con atención online para todo el
              país.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
