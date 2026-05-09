"use client";

import { useEffect, useState } from "react";
import { deleteUsuario, getUsuarios } from "@/services/usuarios";
import { getUsuarioActual } from "@/services/auth";
import { useNotifications } from "@/components/ui/NotificationProvider";
import {
  puedeCrearOEditarColaboradores,
  puedeEliminarUsuarios,
  puedeGestionarColaboradores,
} from "@/services/permisos";
import ColaboradorCard from "./ColaboradorCard";

export default function ColaboradoresClient() {
  const { confirmDialog, error: notifyError, success } = useNotifications();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const usuarioActual = getUsuarioActual();
  const puedeGestionar = puedeGestionarColaboradores(usuarioActual);
  const puedeEditar = puedeCrearOEditarColaboradores(usuarioActual);
  const puedeEliminar = puedeEliminarUsuarios(usuarioActual);

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
    if (!puedeEliminar) {
      notifyError("no tenés permisos para esta acción");
      return;
    }

    const usuario = usuarios.find((item) => item.id === id);
    const confirmar = await confirmDialog({
      title: "desactivar usuario",
      message: `¿desactivar ${usuario?.nombre || "este usuario"}?`,
      confirmLabel: "desactivar",
    });

    if (!confirmar) {
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
      success("usuario desactivado");
    } catch (err) {
      notifyError(err.data?.error || "no pudimos desactivar el usuario");
    } finally {
      setSaving(false);
    }
  };

  if (!puedeGestionar) {
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
          canEdit={puedeEditar}
          canDeactivate={puedeEliminar}
          onDeactivate={desactivarUsuario}
        />
      ))}
    </div>
  );
}
