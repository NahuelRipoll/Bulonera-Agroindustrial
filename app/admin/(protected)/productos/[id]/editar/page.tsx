import { createClient } from "@/lib/supabase-server";
import { actualizarProducto } from "../../actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: producto }, { data: rubros }] = await Promise.all([
    supabase.from("productos").select("*").eq("id", id).single(),
    supabase.from("rubros").select("*").order("orden"),
  ]);

  if (!producto) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/productos"
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold">Editar producto</h1>
      </div>

      <form
        action={actualizarProducto}
        className="bg-white rounded-xl shadow-sm p-6 space-y-6"
      >
        <input type="hidden" name="id" value={producto.id} />
        <input
          type="hidden"
          name="imagen_actual"
          value={producto.imagen_url || ""}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del producto *
          </label>
          <input
            name="nombre"
            required
            defaultValue={producto.nombre}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rubro
          </label>
          <select
            name="rubro_id"
            defaultValue={producto.rubro_id || ""}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
          >
            <option value="">Sin rubro</option>
            {rubros?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            rows={4}
            defaultValue={producto.descripcion || ""}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
          />
        </div>

        <div>
          {producto.imagen_url && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Imagen actual
              </p>
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                <Image
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {producto.imagen_url ? "Reemplazar imagen" : "Subir imagen"}
          </label>
          <input
            name="imagen"
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="activo"
            id="activo"
            defaultChecked={producto.activo}
            className="w-4 h-4 accent-orange-500"
          />
          <label htmlFor="activo" className="text-sm font-medium text-gray-700">
            Producto activo (visible en el catálogo)
          </label>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Guardar cambios
          </button>
          <Link
            href="/admin/productos"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
