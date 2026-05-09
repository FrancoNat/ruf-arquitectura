"use client";

import { useMemo, useState } from "react";
import { useNotifications } from "@/components/ui/NotificationProvider";

const baseState = {
  nombre: "",
  email: "",
  password: "",
  rol: "colaborador",
  activo: true,
};

export default function ColaboradorForm({
  initialData = null,
  mode = "nuevo",
  onSubmit,
  isSubmitting = false,
}) {
  const { error: notifyError } = useNotifications();
  const initialState = useMemo(
    () => ({
      ...baseState,
      ...initialData,
      password: "",
      activo: initialData?.activo ?? true,
    }),
    [initialData]
  );
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.nombre.trim() || !form.email.trim()) {
      notifyError("completá nombre y email");
      return;
    }

    if (mode === "nuevo" && form.password.length < 6) {
      notifyError("la contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (mode === "editar" && form.password && form.password.length < 6) {
      notifyError("la nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    await onSubmit({
      nombre: form.nombre,
      email: form.email,
      password: form.password,
      rol: form.rol,
      activo: form.activo,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-text/80">
            <span>nombre</span>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2 text-sm text-text/80">
            <span>email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2 text-sm text-text/80">
            <span>{mode === "nuevo" ? "contraseña" : "nueva contraseña"}</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={mode === "editar" ? "dejar vacío para mantener" : ""}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2 text-sm text-text/80">
            <span>rol</span>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="colaborador">colaborador</option>
              <option value="admin">admin</option>
            </select>
          </label>

          <label className="flex items-center gap-3 text-sm text-text/80">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
              className="h-4 w-4 accent-primary"
            />
            usuario activo
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-primary px-5 py-3 text-sm text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isSubmitting ? "guardando..." : "guardar usuario"}
      </button>
    </form>
  );
}
