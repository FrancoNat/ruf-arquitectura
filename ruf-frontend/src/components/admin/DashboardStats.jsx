"use client";

import { useEffect, useState } from "react";
import AdminCard from "@/components/admin/AdminCard";
import { getAdminReuniones } from "@/services/agenda";
import { getAdminProyectos } from "@/services/proyectos";
import { getAdminTestimonios } from "@/services/testimonios";

const initialStats = {
  proyectos: "...",
  resenas: "...",
  reuniones: "...",
};

export default function DashboardStats() {
  const [stats, setStats] = useState(initialStats);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    Promise.all([
      getAdminProyectos(),
      getAdminTestimonios(),
      getAdminReuniones(),
    ])
      .then(([proyectos, testimonios, reuniones]) => {
        if (!activo) return;

        setStats({
          proyectos: String(proyectos.length),
          resenas: String(testimonios.length),
          reuniones: String(reuniones.length),
        });
        setError("");
      })
      .catch(() => {
        if (activo) {
          setError("no pudimos cargar las métricas del dashboard");
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-5">
      <AdminCard
        titulo="proyectos"
        valor={stats.proyectos}
        className="min-w-0"
      />
      <AdminCard
        titulo="reseñas"
        valor={stats.resenas}
        className="min-w-0"
      />
      <AdminCard
        titulo="reuniones"
        valor={stats.reuniones}
        className="min-w-0"
      />

      {error ? (
        <div className="rounded-2xl border border-primary/10 bg-white p-5 text-sm text-primary shadow-sm sm:col-span-2 xl:col-span-3">
          {error}
        </div>
      ) : null}
    </div>
  );
}
