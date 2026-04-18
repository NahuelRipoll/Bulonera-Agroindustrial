import { createClient } from "@/lib/supabase-server";
import ProductoForm from "../ProductoForm";
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

      <ProductoForm rubros={rubros || []} />
    </div>
  );
}
