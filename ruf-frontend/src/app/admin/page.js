"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/services/auth";
import { useNotifications } from "@/components/ui/NotificationProvider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { error: notifyError } = useNotifications();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      notifyError("completa email y contraseña");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login(form.email, form.password);
      router.push("/admin/dashboard");
    } catch (err) {
      if (err.status === 403) {
        setError("tu usuario está inactivo");
        return;
      }

      setError("email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#f8f4ef] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <Image
            src="/images/logos/Logo marron png.png"
            alt="rüf arquitectura"
            width={200}
            height={80}
            className="mx-auto mb-5 h-14 w-auto"
          />

          <p className="text-xs uppercase tracking-[0.22em] text-primary/60">
            acceso admin
          </p>
          <h1 className="mt-3 text-3xl font-light text-primary">ingresar</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block space-y-2 text-sm text-text/80">
            <span>email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="block space-y-2 text-sm text-text/80">
            <span>contraseña</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary px-5 py-3 text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {loading ? "ingresando..." : "ingresar"}
          </button>
        </form>

        {error ? (
          <p className="mt-4 rounded-2xl border border-primary/10 bg-background p-4 text-sm text-primary">
            {error}
          </p>
        ) : null}

        <div className="mt-5 text-center text-sm text-text/60">
          <Link href="/" className="transition hover:text-primary">
            volver al sitio
          </Link>
        </div>
      </div>
    </main>
  );
}
