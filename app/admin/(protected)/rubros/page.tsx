import { createClient } from "@/lib/supabase-server";
import { crearRubro, eliminarRubro, toggleDestacado } from "./actions";
import DeleteButton from "@/components/DeleteButton";
import Link from "next/link";

export default async function AdminRubrosPage() {
  const supabase = await createClient();
  const { data: rubros } = await supabase
    .from("rubros")
    .select("id, nombre, orden, destacado, productos(count)")
    .order("orden");

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Rubros</h1>

      {/* Formulario nuevo rubro */}
      <form
        action={crearRubro}
        className="bg-white rounded-xl shadow-sm p-6 mb-6 flex gap-4 items-end"
      >
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nuevo rubro
          </label>
          <input
            name="nombre"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            placeholder="Nombre del rubro"
          />
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
        >
          + Agregar
        </button>
      </form>

      {/* Lista de rubros */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {!rubros || rubros.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No hay rubros cargados.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {rubros.map((rubro) => {
              const count =
                Array.isArray(rubro.productos) && rubro.productos.length > 0
                  ? (rubro.productos[0] as { count: number }).count
                  : 0;
              return (
                <li
                  key={rubro.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">{rubro.nombre}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {count} producto{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={toggleDestacado.bind(null, rubro.id, rubro.destacado ?? false)}>
                      <button
                        type="submit"
                        title={rubro.destacado ? "Quitar del inicio" : "Mostrar en inicio"}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                          rubro.destacado
                            ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                            : "bg-white text-gray-400 border-gray-300 hover:border-orange-400 hover:text-orange-500"
                        }`}
                      >
                        Inicio
                      </button>
                    </form>
                    <Link
                      href={`/admin/rubros/${rubro.id}`}
                      className="text-sm text-gray-600 hover:text-orange-500 font-medium px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      Editar
                    </Link>
                    <DeleteButton
                      action={eliminarRubro.bind(null, rubro.id)}
                      confirmMessage={`¿Eliminás el rubro "${rubro.nombre}"? Los productos asociados quedarán sin rubro.`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        Podés marcar hasta 6 rubros como "Inicio" para mostrarlos en la página principal.
      </p>
    </div>
  );
}
