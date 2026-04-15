import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: totalProductos }, { count: totalRubros }, { count: totalContactos }] =
    await Promise.all([
      supabase.from("productos").select("*", { count: "exact", head: true }),
      supabase.from("rubros").select("*", { count: "exact", head: true }),
      supabase.from("contactos").select("*", { count: "exact", head: true }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Productos", value: totalProductos ?? 0 },
          { label: "Rubros", value: totalRubros ?? 0 },
          { label: "Consultas recibidas", value: totalContactos ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-4xl font-bold text-orange-500 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/productos/nuevo"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Nuevo producto
        </Link>
        <Link
          href="/admin/productos"
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Ver todos los productos
        </Link>
        <Link
          href="/admin/rubros"
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Gestionar rubros
        </Link>
      </div>
    </div>
  );
}
