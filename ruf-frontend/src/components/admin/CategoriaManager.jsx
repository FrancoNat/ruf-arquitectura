"use client";

import { useEffect, useState } from "react";
import {
  createCategoria,
  deleteCategoria,
  getCategorias,
  updateCategoria,
} from "@/services/categorias";
import { useNotifications } from "@/components/ui/NotificationProvider";

export default function CategoriaManager() {
  const { confirmDialog, error: notifyError, success } = useNotifications();
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [categoriaAbiertaId, setCategoriaAbiertaId] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let activo = true;

    getCategorias()
      .then((data) => {
        if (!activo) return;

        setError("");
        setCategorias(data);
      })
      .catch(() => {
        if (activo) {
          setError("no pudimos cargar las categorías");
        }
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

  const agregarCategoria = async () => {
    const nombre = nuevaCategoria.trim();

    if (!nombre) {
      notifyError("completá el nombre de la categoría");
      return;
    }

    try {
      setSaving(true);
      const categoriaNueva = await createCategoria({ nombre });
      setCategorias((prev) => [...prev, categoriaNueva].sort(ordenarPorNombre));
      setNuevaCategoria("");
      setCategoriaAbiertaId(categoriaNueva.id);
      success("categoría agregada");
    } catch (err) {
      if (err.status === 409) {
        notifyError(err.data?.error || "esa categoría ya existe");
        return;
      }

      notifyError("no pudimos guardar la categoría");
    } finally {
      setSaving(false);
    }
  };

  const iniciarEdicion = (categoria) => {
    setCategoriaAbiertaId(categoria.id);
    setEditandoId(categoria.id);
    setNombreEditado(categoria.nombre);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombreEditado("");
  };

  const guardarEdicion = async (id) => {
    const nombre = nombreEditado.trim();

    if (!nombre) {
      notifyError("completá el nombre de la categoría");
      return;
    }

    try {
      setSaving(true);
      const categoriaActualizada = await updateCategoria(id, { nombre });
      setCategorias((prev) =>
        prev
          .map((categoria) =>
            categoria.id === id ? categoriaActualizada : categoria
          )
          .sort(ordenarPorNombre)
      );
      cancelarEdicion();
      setCategoriaAbiertaId(id);
      success("categoría actualizada");
    } catch (err) {
      if (err.status === 409) {
        notifyError(err.data?.error || "esa categoría ya existe");
        return;
      }

      notifyError("no pudimos actualizar la categoría");
    } finally {
      setSaving(false);
    }
  };

  const eliminarCategoria = async (id) => {
    const categoria = categorias.find((item) => item.id === id);
    const confirmar = await confirmDialog({
      title: "eliminar categoría",
      message: `¿eliminar ${categoria?.nombre || "esta categoría"}?`,
      confirmLabel: "eliminar",
    });

    if (!confirmar) {
      return;
    }

    try {
      setSaving(true);
      await deleteCategoria(id);
      setCategorias((prev) => prev.filter((categoria) => categoria.id !== id));
      setCategoriaAbiertaId(null);
      cancelarEdicion();
      success("categoría eliminada");
    } catch (err) {
      if (err.status === 409) {
        notifyError(err.data?.error || "no se puede eliminar una categoría en uso");
        return;
      }

      notifyError("no pudimos eliminar la categoría");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-xl text-primary">categorías</h2>
          <p className="mt-2 text-sm leading-relaxed text-text/65">
            administrá las categorías que después podés usar como filtro o como
            tipo de proyecto, por ejemplo casa, quincho, interior o muebles.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={nuevaCategoria}
            onChange={(event) => setNuevaCategoria(event.target.value)}
            placeholder="nueva categoría"
            className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
          />

          <button
            type="button"
            onClick={agregarCategoria}
            disabled={saving}
            className="w-fit rounded-full bg-primary px-4 py-2 text-sm text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-55 sm:rounded-xl sm:px-5 sm:py-3"
          >
            agregar categoría
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-text/60">cargando categorías...</p>
        ) : null}

        {error ? <p className="text-sm text-primary">{error}</p> : null}

        {!loading && !error && categorias.length === 0 ? (
          <p className="text-sm text-text/60">todavía no hay categorías</p>
        ) : null}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="relative"
            >
              <button
                type="button"
                onClick={() => {
                  setCategoriaAbiertaId((prev) =>
                    prev === categoria.id ? null : categoria.id
                  );
                  cancelarEdicion();
                }}
                className={`w-full truncate rounded-xl border px-4 py-3 text-left text-sm transition ${
                  categoriaAbiertaId === categoria.id
                    ? "border-primary/25 bg-white text-primary shadow-sm"
                    : "border-black/10 bg-background text-text/80 hover:bg-white"
                }`}
              >
                {categoria.nombre}
              </button>

              {categoriaAbiertaId === categoria.id ? (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-2xl border border-black/5 bg-[#fffaf4] p-3 shadow-[0_18px_50px_rgba(44,32,24,0.14)]">
                  {editandoId === categoria.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={nombreEditado}
                        onChange={(event) => setNombreEditado(event.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => guardarEdicion(categoria.id)}
                          disabled={saving}
                          className="rounded-full bg-primary px-3 py-2 text-xs text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-55"
                        >
                          guardar
                        </button>
                        <button
                          type="button"
                          onClick={cancelarEdicion}
                          disabled={saving}
                          className="rounded-full border border-primary/20 px-3 py-2 text-xs text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-55"
                        >
                          cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <button
                        type="button"
                        onClick={() => iniciarEdicion(categoria)}
                        disabled={saving}
                        className="rounded-xl border border-primary/15 px-3 py-2 text-left text-xs text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        editar categoría
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminarCategoria(categoria.id)}
                        disabled={saving}
                        className="rounded-xl bg-primary px-3 py-2 text-left text-xs text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        borrar categoría
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ordenarPorNombre(a, b) {
  return a.nombre.localeCompare(b.nombre);
}
