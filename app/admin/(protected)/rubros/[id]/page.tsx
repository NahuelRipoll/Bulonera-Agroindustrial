import { createClient } from "@/lib/supabase-server";
import { editarRubro } from "../actions";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function EditarRubroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: rubro } = await supabase
    .from("rubros")
    .select("*")
    .eq("id", id)
    .single();

  if (!rubro) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/rubros"
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold">Editar rubro</h1>
      </div>

      <form action={editarRubro} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <input type="hidden" name="id" value={rubro.id} />
        <input type="hidden" name="imagen_actual" value={rubro.imagen_url ?? ""} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            name="nombre"
            required
            defaultValue={rubro.nombre}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            rows={3}
            defaultValue={rubro.descripcion ?? ""}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
            placeholder="Breve descripción del rubro..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen
          </label>
          {rubro.imagen_url && (
            <div className="mb-3 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={rubro.imagen_url}
                alt={rubro.nombre}
                fill
                className="object-cover"
              />
            </div>
          )}
          <input
            name="imagen"
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
          />
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG o WEBP. Máximo recomendado: 2MB.
            {rubro.imagen_url && " Subir una nueva imagen reemplaza la actual."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="destacado"
            id="destacado"
            defaultChecked={rubro.destacado ?? false}
            className="w-4 h-4 accent-orange-500"
          />
          <label htmlFor="destacado" className="text-sm font-medium text-gray-700">
            Mostrar en la página de inicio
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
            href="/admin/rubros"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
