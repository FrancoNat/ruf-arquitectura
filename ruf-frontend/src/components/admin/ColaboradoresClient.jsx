"use client";

import { useEffect, useState } from "react";
import { deleteUsuario, getUsuarios } from "@/services/usuarios";
import { getUsuarioActual } from "@/services/auth";
import ColaboradorCard from "./ColaboradorCard";

export default function ColaboradoresClient() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const usuarioActual = getUsuarioActual();
  const esAdmin = usuarioActual?.rol === "admin";

  useEffect(() => {
    let activo = true;

    getUsuarios()
      .then((data) => {
        if (!activo) return;
        setUsuarios(data);
        setError("");
      })
      .catch((err) => {
        if (!activo) return;
        setError(err.message || "no pudimos cargar los colaboradores");
      })
      .finally(() => {
        if (activo) {
          setLoading(false);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  const desactivarUsuario = async (id) => {
    if (!esAdmin) {
      alert("no tenés permisos para esta acción");
      return;
    }

    try {
      setSaving(true);
      await deleteUsuario(id);
      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === id ? { ...usuario, activo: false } : usuario
        )
      );
      alert("usuario desactivado");
    } catch (err) {
      alert(err.data?.error || "no pudimos desactivar el usuario");
    } finally {
      setSaving(false);
    }
  };

  if (!esAdmin) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-text/70 shadow-sm">
        no tenés permisos para gestionar colaboradores
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-text/70 shadow-sm">
        cargando colaboradores...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-primary shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {usuarios.map((usuario) => (
        <ColaboradorCard
          key={usuario.id}
          usuario={usuario}
          disabled={saving}
          onDeactivate={desactivarUsuario}
        />
      ))}
    </div>
  );
}
