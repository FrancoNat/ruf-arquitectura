"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar({ alwaysVisible = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    if (alwaysVisible) {
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysVisible]);

  const showSolidNavbar = alwaysVisible || scrolled;
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-400 ${
        showSolidNavbar
          ? "bg-primary/80 backdrop-blur border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 py-3 text-xs tracking-wide text-white sm:px-6 md:py-4 md:text-sm">
        <div className="flex items-center justify-between md:hidden">
          <Link href="/" onClick={cerrarMenu}>
            <Image
              src="/images/logos/Logo-marron-png.svg"
              alt="rüf arquitectura"
              width={144}
              height={48}
              className="h-7 w-auto sm:h-8"
            />
          </Link>

          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuAbierto((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white/90 transition hover:bg-white/10"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>

        {menuAbierto ? (
          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-white/10 bg-primary/95 p-4 text-sm text-white/80 md:hidden">
            <Link href="/" onClick={cerrarMenu} className="hover:text-white transition">
              inicio
            </Link>
            <Link
              href="/proyectos"
              onClick={cerrarMenu}
              className="hover:text-white transition"
            >
              proyectos
            </Link>
            <Link
              href="/quienes-somos"
              onClick={cerrarMenu}
              className="hover:text-white transition"
            >
              quiénes somos
            </Link>
            <Link
              href="/agenda"
              onClick={cerrarMenu}
              className="mt-2 rounded-lg border border-white/30 px-3 py-2 text-center text-white transition hover:bg-white hover:text-black"
            >
              agenda
            </Link>
          </div>
        ) : null}

        <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-white/80 md:w-auto md:justify-start md:gap-6">
            <Link href="/" className="hover:text-white transition">
              inicio
            </Link>
            <Link href="/proyectos" className="hover:text-white transition">
              proyectos
            </Link>
          </div>

          <div className="flex justify-center">
            <Link href="/">
              <Image
                src="/images/logos/Logo-marron-png.svg"
                alt="rüf arquitectura"
                width={180}
                height={72}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-white/80 md:w-auto md:justify-end md:gap-6">
            <Link href="/quienes-somos" className="hover:text-white transition">
              quiénes somos
            </Link>

            <Link
              href="/agenda"
              className="rounded-lg border border-white/30 px-3 py-1.5 text-xs transition hover:bg-white hover:text-black sm:px-4 sm:py-2 md:text-sm"
            >
              agenda
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
