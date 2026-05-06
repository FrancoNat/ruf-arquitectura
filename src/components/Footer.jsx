import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary pb-8 pt-14 text-white sm:pt-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <div>
          <Image
            src="/images/logos/Logo-marron-png.svg"
            alt="logo de rüf arquitectura"
            width={180}
            height={72}
            className="mb-4 h-8 sm:h-10"
          />

          <p className="text-white/70 text-sm leading-relaxed">
            estudio de arquitectura en buenos aires, argentina, con atención
            online en todo el país.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.instagram.com/ruf.arquitectura/"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#e6d7c3] transition hover:bg-white hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </a>

            <a
              href="https://www.tiktok.com/@ruf.arquitectura"
              aria-label="TikTok"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#e6d7c3] transition hover:bg-white hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M14.6 3c.3 1.8 1.4 3.3 3.1 4.1 1 .5 2 .8 3.1.8v3a9 9 0 0 1-3.3-.6v5.4a6 6 0 1 1-6-6c.3 0 .6 0 .9.1v3.1a3 3 0 1 0 2.2 2.9V3h3Z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-white/80">
            navegación
          </h3>

          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link href="/" className="hover:text-white">
                inicio
              </Link>
            </li>
            <li>
              <Link href="/proyectos" className="hover:text-white">
                proyectos
              </Link>
            </li>
            <li>
              <Link href="/quienes-somos" className="hover:text-white">
                quiénes somos
              </Link>
            </li>
            <li>
              <Link href="/agenda" className="hover:text-white">
                agenda
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-white/80">
            contacto
          </h3>

          <ul className="space-y-2 text-sm text-white/70">
            <li>Buenos Aires, Argentina</li>
            <li>atención online</li>
            <li>rufarquitectura@gmail.com</li>
            <li>+54 9 1176619112</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-white/80">
            contacto directo
          </h3>

          <a
            href="https://wa.me/5491176619112"
            target="_blank"
            rel="noreferrer"
            className="inline-block w-full rounded-lg border border-white/30 px-5 py-3 text-center transition hover:bg-white hover:text-primary sm:w-auto"
          >
            escribir por whatsapp
          </a>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 px-4 pt-6 sm:mt-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs text-white/50">
            © {new Date().getFullYear()} rüf arquitectura. todos los derechos reservados.
          </p>

          <Link
            href="/admin"
            className="mt-4 ml-auto block w-fit rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs text-[#e6d7c3] transition hover:bg-white hover:text-primary"
          >
            acceso admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
