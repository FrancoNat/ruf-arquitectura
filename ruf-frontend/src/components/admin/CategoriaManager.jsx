"use client";

import { useEffect, useState } from "react";
import {
  createCategoria,
  deleteCategoria,
  getCategorias,
  updateCategoria,
} from "@/services/categorias";

export default function CategoriaManager() {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
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
      alert("completá el nombre de la categoría");
      return;
    }

    try {
      setSaving(true);
      const categoriaNueva = await createCategoria({ nombre });
      setCategorias((prev) => [...prev, categoriaNueva].sort(ordenarPorNombre));
      setNuevaCategoria("");
      alert("categoría agregada");
    } catch (err) {
      if (err.status === 409) {
        alert(err.data?.error || "esa categoría ya existe");
        return;
      }

      alert("no pudimos guardar la categoría");
    } finally {
      setSaving(false);
    }
  };

  const iniciarEdicion = (categoria) => {
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
      alert("completá el nombre de la categoría");
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
      alert("categoría actualizada");
    } catch (err) {
      if (err.status === 409) {
        alert(err.data?.error || "esa categoría ya existe");
        return;
      }

      alert("no pudimos actualizar la categoría");
    } finally {
      setSaving(false);
    }
  };

  const eliminarCategoria = async (id) => {
    try {
      setSaving(true);
      await deleteCategoria(id);
      setCategorias((prev) => prev.filter((categoria) => categoria.id !== id));
      alert("categoría eliminada");
    } catch (err) {
      if (err.status === 409) {
        alert(err.data?.error || "no se puede eliminar una categoría en uso");
        return;
      }

      alert("no pudimos eliminar la categoría");
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
            className="rounded-xl bg-primary px-5 py-3 text-sm text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-55"
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

        <div className="flex flex-wrap gap-3">
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="flex items-center gap-3 rounded-full border border-black/10 bg-background px-4 py-2 text-sm text-text/80"
            >
              {editandoId === categoria.id ? (
                <input
                  type="text"
                  value={nombreEditado}
                  onChange={(event) => setNombreEditado(event.target.value)}
                  className="w-32 rounded-full border border-black/10 bg-white px-3 py-1 text-sm outline-none transition focus:border-primary"
                />
              ) : (
                <span>{categoria.nombre}</span>
              )}

              {editandoId === categoria.id ? (
                <>
                  <button
                    type="button"
                    onClick={() => guardarEdicion(categoria.id)}
                    disabled={saving}
                    className="rounded-full border border-primary/20 px-2 py-1 text-xs text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    guardar
                  </button>
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    disabled={saving}
                    className="rounded-full border border-black/10 px-2 py-1 text-xs text-text/60 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => iniciarEdicion(categoria)}
                    disabled={saving}
                    className="rounded-full border border-primary/20 px-2 py-1 text-xs text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    editar
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminarCategoria(categoria.id)}
                    disabled={saving}
                    className="rounded-full border border-primary/20 px-2 py-1 text-xs text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    borrar
                  </button>
                </>
              )}
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
