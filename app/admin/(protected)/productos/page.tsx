import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import ProductosTable from "@/components/ProductosTable";

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
        <ProductosTable productos={productos} />
      )}
    </div>
  );
}
