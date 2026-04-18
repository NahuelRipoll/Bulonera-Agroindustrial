import { createClient } from "@/lib/supabase-server";
import ProductoForm from "../../ProductoForm";
import { notFound } from "next/navigation";
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

      <ProductoForm rubros={rubros || []} producto={producto} />
    </div>
  );
}
