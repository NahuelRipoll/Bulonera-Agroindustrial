"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  eliminarProducto,
  eliminarProductos,
  toggleTendenciaProducto,
} from "@/app/admin/(protected)/productos/actions";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  tendencia?: boolean | null;
  tendencia_orden?: number | null;
  imagen_url: string | null;
  created_at?: string | null;
  rubros: { nombre: string } | null;
}

export default function ProductosTable({ productos }: { productos: Producto[] }) {
  const router = useRouter();
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [errorTendencia, setErrorTendencia] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const todosSeleccionados =
    productos.length > 0 && seleccionados.size === productos.length;

  useEffect(() => {
    if (!productoSeleccionado) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setProductoSeleccionado(null);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [productoSeleccionado]);

  function toggleTodos() {
    if (todosSeleccionados) {
      setSeleccionados(new Set());
    } else {
      setSeleccionados(new Set(productos.map((p) => p.id)));
    }
  }

  function toggleUno(id: string) {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleEliminarSeleccionados() {
    if (
      !window.confirm(
        `¿Eliminás los ${seleccionados.size} productos seleccionados? Esta acción no se puede deshacer.`
      )
    )
      return;

    const ids = Array.from(seleccionados);
    const urls = productos
      .filter((p) => ids.includes(p.id))
      .map((p) => p.imagen_url ?? "");

    startTransition(async () => {
      await eliminarProductos(ids, urls);
      setSeleccionados(new Set());
    });
  }

  function handleToggleTendencia(producto: Producto) {
    setErrorTendencia(null);
    startTransition(async () => {
      const result = await toggleTendenciaProducto(
        producto.id,
        producto.tendencia ?? false
      );

      if (!result.ok) {
        setErrorTendencia(result.error ?? "No se pudo actualizar tendencia.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <>
      {seleccionados.size > 0 && (
        <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 mb-4">
          <span className="text-sm text-orange-700 font-medium">
            {seleccionados.size} producto{seleccionados.size > 1 ? "s" : ""} seleccionado{seleccionados.size > 1 ? "s" : ""}
          </span>
          <button
            onClick={handleEliminarSeleccionados}
            disabled={isPending}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-40"
          >
            {isPending ? "Eliminando..." : "Eliminar seleccionados"}
          </button>
        </div>
      )}

      {errorTendencia && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
          {errorTendencia}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={todosSeleccionados}
                  onChange={toggleTodos}
                  className="rounded border-gray-300 accent-orange-500"
                />
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Producto
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 hidden md:table-cell">
                Rubro
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 hidden sm:table-cell">
                Estado
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 hidden lg:table-cell">
                Inicio
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {productos.map((producto) => (
              <tr
                key={producto.id}
                className={`hover:bg-gray-50 ${seleccionados.has(producto.id) ? "bg-orange-50" : ""}`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={seleccionados.has(producto.id)}
                    onChange={() => toggleUno(producto.id)}
                    className="rounded border-gray-300 accent-orange-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {producto.imagen_url ? (
                        <Image
                          src={producto.imagen_url}
                          alt={producto.nombre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          Sin foto
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{producto.nombre}</p>
                      {producto.descripcion && (
                        <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">
                          {producto.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                  {producto.rubros?.nombre ?? "—"}
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        producto.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {producto.activo ? "Activo" : "Oculto"}
                    </span>
                    {producto.tendencia && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-orange-100 text-orange-700">
                        Tendencia
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <button
                    type="button"
                    onClick={() => handleToggleTendencia(producto)}
                    disabled={isPending}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40 ${
                      producto.tendencia
                        ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                        : "bg-white text-gray-400 border-gray-300 hover:border-orange-400 hover:text-orange-500"
                    }`}
                  >
                    Tendencia
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4 justify-end">
                    <button
                      onClick={() => setProductoSeleccionado(producto)}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Ver
                    </button>
                    <Link
                      href={`/admin/productos/${producto.id}/editar`}
                      className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          !window.confirm(
                            `¿Eliminás "${producto.nombre}"? Esta acción no se puede deshacer.`
                          )
                        )
                          return;
                        startTransition(async () => {
                          await eliminarProducto(producto.id, producto.imagen_url ?? "");
                        });
                      }}
                      disabled={isPending}
                      className="text-sm text-red-500 hover:text-red-600 disabled:opacity-40 font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productoSeleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
          onClick={() => setProductoSeleccionado(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="producto-modal-title"
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase text-orange-500">
                  {productoSeleccionado.rubros?.nombre ?? "Sin rubro"}
                </p>
                <h2
                  id="producto-modal-title"
                  className="text-xl font-bold text-gray-900 mt-1"
                >
                  {productoSeleccionado.nombre}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setProductoSeleccionado(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-[280px_1fr]">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                {productoSeleccionado.imagen_url ? (
                  <Image
                    src={productoSeleccionado.imagen_url}
                    alt={productoSeleccionado.nombre}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="object-contain p-3"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                    Sin foto
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      productoSeleccionado.activo
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {productoSeleccionado.activo ? "Activo" : "Oculto"}
                  </span>
                  {productoSeleccionado.created_at && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                      Cargado el{" "}
                      {new Date(productoSeleccionado.created_at).toLocaleDateString(
                        "es-AR"
                      )}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                  </h3>
                  {productoSeleccionado.descripcion ? (
                    <p className="text-sm text-gray-600 whitespace-pre-line leading-6">
                      {productoSeleccionado.descripcion}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Este producto no tiene descripción cargada.
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href={`/admin/productos/${productoSeleccionado.id}/editar`}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Editar producto
                  </Link>
                  <button
                    type="button"
                    onClick={() => setProductoSeleccionado(null)}
                    className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
