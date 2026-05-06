import Image from "next/image";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { proyectos } from "@/data/proyectos";

export default function ProyectosPage() {
  return (
    <>
      <Navbar alwaysVisible />

      <main className="bg-background pb-16 pt-36 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="mb-10 text-3xl text-primary sm:mb-12 sm:text-4xl">
            proyectos
          </h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {proyectos.map((proyecto) => (
              <Link
                key={proyecto.id}
                href={`/proyectos/${proyecto.id}`}
                className="group block"
              >
                <div className="relative h-72 overflow-hidden rounded-lg sm:h-80 md:h-64">
                  <Image
                    src={proyecto.imagen}
                    alt={proyecto.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <h2 className="mt-3 text-lg text-primary">
                  {proyecto.titulo}
                </h2>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
