"use client";

import { useEffect, useState } from "react";
import ProyectoAdminCard from "@/components/admin/ProyectoAdminCard";
import { getAdminProyectos } from "@/services/proyectos";

export default function AdminProyectosClient() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;

    getAdminProyectos()
      .then((data) => {
        if (!activo) return;
        setProyectos(data);
        setError(false);
      })
      .catch(() => {
        if (!activo) return;
        setProyectos([]);
        setError(true);
      })
      .finally(() => {
        if (!activo) return;
        setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-8 text-sm text-text/60">
        cargando proyectos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-8 text-sm text-text/60">
        no pudimos cargar los proyectos
      </div>
    );
  }

  if (proyectos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-8 text-sm text-text/60">
        todavía no hay proyectos cargados.
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {proyectos.map((proyecto) => (
        <ProyectoAdminCard
          key={proyecto.id}
          proyecto={proyecto}
        />
      ))}
    </div>
  );
}
