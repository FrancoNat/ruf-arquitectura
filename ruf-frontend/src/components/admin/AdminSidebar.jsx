"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUsuarioActual, logout } from "@/services/auth";

const links = [
  { href: "/admin/dashboard", label: "dashboard" },
  { href: "/admin/proyectos", label: "gestionar proyectos" },
  { href: "/admin/proyectos/nuevo", label: "nuevo proyecto" },
  { href: "/admin/testimonios", label: "testimonios" },
  { href: "/admin/agenda", label: "agenda" },
  { href: "/admin/colaboradores", label: "colaboradores", adminOnly: true },
  { href: "/", label: "volver al sitio" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const usuario = getUsuarioActual();

  const cerrarSesion = () => {
    logout();
    router.push("/admin");
  };

  return (
    <aside className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-xs tracking-[0.2em] text-primary/60 uppercase">
        rüf admin
      </p>

      {usuario ? (
        <div className="mt-4 rounded-xl bg-background px-4 py-3 text-xs text-text/65">
          <p className="font-medium text-primary">{usuario.nombre}</p>
          <p className="mt-1">{usuario.rol}</p>
        </div>
      ) : null}

      <nav className="mt-5 flex flex-col gap-2">
        {links
          .filter((link) => !link.adminOnly || usuario?.rol === "admin")
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-3 text-sm text-text/80 transition hover:bg-background hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

        <button
          type="button"
          onClick={cerrarSesion}
          className="rounded-xl px-4 py-3 text-left text-sm text-text/80 transition hover:bg-background hover:text-primary"
        >
          cerrar sesión
        </button>
      </nav>
    </aside>
  );
}
