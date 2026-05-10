"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getUsuarioActual, logout } from "@/services/auth";

const links = [
  { href: "/admin/dashboard", label: "dashboard" },
  { href: "/admin/proyectos", label: "gestionar proyectos" },
  { href: "/admin/testimonios", label: "testimonios" },
  { href: "/admin/agenda", label: "agenda" },
  { href: "/", label: "volver al sitio" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const usuario = getUsuarioActual();

  const cerrarSesion = () => {
    logout();
    router.push("/admin");
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-black/5 bg-[#f8f4ef]/92 px-4 py-3 shadow-[0_10px_30px_rgba(44,32,24,0.06)] backdrop-blur-md lg:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-[40px_1fr_40px] items-center gap-3">
          <span aria-hidden="true"></span>

          <Image
            src="/images/logos/Logo marron png.png"
            alt="rüf arquitectura"
            width={150}
            height={60}
            className="mx-auto h-9 w-auto"
          />

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label="abrir menú admin"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-primary/15 bg-background text-primary transition hover:bg-white"
          >
            <span className="h-px w-5 bg-current"></span>
            <span className="h-px w-5 bg-current"></span>
            <span className="h-px w-5 bg-current"></span>
          </button>
        </div>

        {open ? (
          <div className="mx-auto mt-3 max-w-7xl rounded-2xl border border-black/5 bg-white/95 p-3 shadow-[0_18px_50px_rgba(44,32,24,0.12)]">
            <AdminNav
              usuario={usuario}
              onLogout={cerrarSesion}
              onNavigate={() => setOpen(false)}
            />
          </div>
        ) : null}
      </header>

      <aside className="hidden rounded-2xl border border-black/5 bg-white p-5 shadow-sm lg:block">
        <Image
          src="/images/logos/Logo marron png.png"
          alt="rüf arquitectura"
          width={160}
          height={64}
          className="mx-auto h-10 w-auto"
        />

        <AdminNav usuario={usuario} onLogout={cerrarSesion} />
      </aside>
    </>
  );
}

function AdminNav({ usuario, onLogout, onNavigate }) {
  return (
    <>
      {usuario ? (
        <div className="rounded-xl bg-background px-4 py-3 text-xs text-text/65 lg:mt-4">
          <p className="font-medium text-primary">{usuario.nombre}</p>
          <p className="mt-1">{usuario.rol}</p>
        </div>
      ) : null}

      <nav className="mt-5 flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="rounded-xl px-4 py-3 text-sm text-text/80 transition hover:bg-background hover:text-primary"
          >
            {link.label}
          </Link>
        ))}

        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl px-4 py-3 text-left text-sm text-text/80 transition hover:bg-background hover:text-primary"
        >
          cerrar sesión
        </button>
      </nav>
    </>
  );
}
