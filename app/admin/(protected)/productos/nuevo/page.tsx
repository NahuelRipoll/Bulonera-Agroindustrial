import { createClient } from "@/lib/supabase-server";
import { crearProducto } from "../actions";
import Link from "next/link";

export default async function NuevoProductoPage() {
  const supabase = await createClient();
  const { data: rubros } = await supabase
    .from("rubros")
    .select("*")
    .order("orden");

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/productos"
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold">Nuevo producto</h1>
      </div>

      <form action={crearProducto} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del producto *
          </label>
          <input
            name="nombre"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            placeholder="Ej: Bulón hexagonal 5/16"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rubro
          </label>
          <select
            name="rubro_id"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
            placeholder="Descripción general del producto..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen
          </label>
          <input
            name="imagen"
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
          />
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG o WEBP. Máximo recomendado: 2MB.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="activo"
            id="activo"
            defaultChecked
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
            Guardar producto
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
