"use client";

import { useEffect, useState } from "react";
import {
  ADMIN_CATEGORIAS_STORAGE_KEY,
  adminCategoriasIniciales,
  normalizarCategoria,
} from "@/data/adminCategorias";

export default function CategoriaManager() {
  const [categorias, setCategorias] = useState(() => {
    if (typeof window === "undefined") {
      return adminCategoriasIniciales;
    }

    const categoriasGuardadas = window.localStorage.getItem(
      ADMIN_CATEGORIAS_STORAGE_KEY
    );

    if (!categoriasGuardadas) {
      return adminCategoriasIniciales;
    }

    try {
      const categoriasParseadas = JSON.parse(categoriasGuardadas);

      if (Array.isArray(categoriasParseadas) && categoriasParseadas.length > 0) {
        return categoriasParseadas;
      }
    } catch {
      window.localStorage.removeItem(ADMIN_CATEGORIAS_STORAGE_KEY);
    }

    return adminCategoriasIniciales;
  });
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  useEffect(() => {
    window.localStorage.setItem(
      ADMIN_CATEGORIAS_STORAGE_KEY,
      JSON.stringify(categorias)
    );
  }, [categorias]);

  const agregarCategoria = () => {
    const nombre = nuevaCategoria.trim();
    const id = normalizarCategoria(nombre);

    if (!nombre) {
      alert("completá el nombre de la categoría");
      return;
    }

    if (!id) {
      alert("ingresá una categoría válida");
      return;
    }

    if (categorias.some((categoria) => categoria.id === id)) {
      alert("esa categoría ya existe");
      return;
    }

    const categoriaNueva = { id, nombre: nombre.toLowerCase() };

    setCategorias((prev) => [...prev, categoriaNueva]);
    setNuevaCategoria("");
    console.log("categoria agregada", categoriaNueva);
    alert("categoría agregada");
  };

  const eliminarCategoria = (id) => {
    if (categorias.length === 1) {
      alert("necesitás al menos una categoría activa");
      return;
    }

    setCategorias((prev) => prev.filter((categoria) => categoria.id !== id));
    console.log("categoria eliminada", id);
    alert("categoría eliminada");
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
            className="rounded-xl bg-primary px-5 py-3 text-sm text-white transition hover:opacity-85"
          >
            agregar categoría
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="flex items-center gap-3 rounded-full border border-black/10 bg-background px-4 py-2 text-sm text-text/80"
            >
              <span>{categoria.nombre}</span>

              <button
                type="button"
                onClick={() => eliminarCategoria(categoria.id)}
                className="rounded-full border border-primary/20 px-2 py-1 text-xs text-primary transition hover:bg-white"
              >
                borrar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
