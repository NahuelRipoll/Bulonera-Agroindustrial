import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { eliminarProducto } from "./actions";
import DeleteButton from "@/components/DeleteButton";

export default async function AdminProductosPage() {
  const supabase = await createClient();
  const { data: productos } = await supabase
    .from("productos")
    .select("*, rubros(nombre)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Productos</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/productos/importar"
            className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm"
          >
            Importar JSON
          </Link>
          <Link
            href="/admin/productos/nuevo"
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm"
          >
            + Nuevo producto
          </Link>
        </div>
      </div>

      {!productos || productos.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm">
          <p className="text-lg">No hay productos cargados todavía.</p>
          <Link
            href="/admin/productos/nuevo"
            className="text-orange-500 hover:underline mt-2 inline-block text-sm"
          >
            Cargar el primero
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
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
                <tr key={producto.id} className="hover:bg-gray-50">
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
                        <p className="font-medium text-gray-900">
                          {producto.nombre}
                        </p>
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
                      <DeleteButton
                        action={eliminarProducto.bind(
                          null,
                          producto.id,
                          producto.imagen_url || ""
                        )}
                        confirmMessage={`¿Eliminás "${producto.nombre}"? Esta acción no se puede deshacer.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
