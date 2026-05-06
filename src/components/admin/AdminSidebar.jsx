import Link from "next/link";

const links = [
  { href: "/admin/dashboard", label: "dashboard" },
  { href: "/admin/proyectos", label: "gestionar proyectos" },
  { href: "/admin/proyectos/nuevo", label: "nuevo proyecto" },
  { href: "/admin/testimonios", label: "testimonios" },
  { href: "/admin/agenda", label: "agenda" },
  { href: "/", label: "volver al sitio" },
];

export default function AdminSidebar() {
  return (
    <aside className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-xs tracking-[0.2em] text-primary/60 uppercase">
        rüf admin
      </p>

      <nav className="mt-5 flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl px-4 py-3 text-sm text-text/80 transition hover:bg-background hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
