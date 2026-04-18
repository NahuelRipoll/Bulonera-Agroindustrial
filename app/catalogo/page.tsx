import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import CatalogoCliente from "./CatalogoCliente";

export const revalidate = 3600; // Re-fetch desde Supabase máximo 1 vez por hora

export const metadata: Metadata = {
  title: "Catálogo de Productos | Bulonera Agroindustrial",
  description:
    "Explorá nuestro catálogo completo de bulonería, herramientas manuales y máquinas eléctricas para el sector agroindustrial en Mendoza.",
};

export default async function CatalogoPage() {
  const supabase = await createClient();

  const [{ data: rubros }, { data: productos }] = await Promise.all([
    supabase.from("rubros").select("*").order("orden"),
    supabase
      .from("productos")
      .select("*, rubros(nombre)")
      .eq("activo", true)
      .order("nombre"),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Catálogo de productos</h1>
          <p className="text-gray-400 mt-2">
            Explorá nuestra variedad de productos
          </p>
        </div>
      </div>
      <CatalogoCliente rubros={rubros || []} productos={productos || []} />
    </div>
  );
}
