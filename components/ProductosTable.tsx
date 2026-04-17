"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { eliminarProducto, eliminarProductos } from "@/app/admin/(protected)/productos/actions";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  imagen_url: string | null;
  rubros: { nombre: string } | null;
}

export default function ProductosTable({ productos }: { productos: Producto[] }) {
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const todosSeleccionados =
    productos.length > 0 && seleccionados.size === productos.length;

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
      next.has(id) ? next.delete(id) : next.add(id);
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
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      producto.activo
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {producto.activo ? "Activo" : "Oculto"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4 justify-end">
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
    </>
  );
}
