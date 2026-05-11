"use client";

import Link from "next/link";
import { useNotifications } from "@/components/ui/NotificationProvider";

const formPath = "/testimonios/formulario";

export default function TestimonioShareActions({ primaryActionClass }) {
  const { error: notifyError, success } = useNotifications();

  const copyLink = async () => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}${formPath}`;

    try {
      await navigator.clipboard.writeText(url);
      success("link copiado");
    } catch {
      notifyError("no pudimos copiar el link");
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Link href={formPath} className={primaryActionClass}>
        abrir formulario
      </Link>
      <button
        type="button"
        onClick={copyLink}
        className="rounded-full border border-primary/15 px-3 py-2 text-xs text-primary transition hover:bg-background sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
      >
        copiar link
      </button>
    </div>
  );
}
