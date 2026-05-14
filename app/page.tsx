import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import ProductoDestacadoCard from "@/components/ProductoDestacadoCard";

export default async function HomePage() {
  const supabase = await createClient();
  const [{ data: rubros }, { data: productosTendencia }] = await Promise.all([
    supabase
      .from("rubros")
      .select("id, nombre")
      .eq("destacado", true)
      .order("orden")
      .limit(6),
    supabase
      .from("productos")
      .select("id, nombre, descripcion, imagen_url, rubros(nombre)")
      .eq("activo", true)
      .eq("tendencia", true)
      .order("tendencia_orden", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return (
    <div>
      <section className="bg-black text-white py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Tu proveedor{" "}
            <span className="text-orange-500">agroindustrial</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Bulonería, herramientas manuales y máquinas eléctricas para el
            sector agropecuario e industrial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalogo"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Ver catálogo
            </Link>
            <Link
              href="/contacto"
              className="border border-white hover:border-orange-500 hover:text-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Contactanos
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold">Productos en tendencia</h2>
              <p className="text-gray-500 mt-2">
                Artículos seleccionados para tener a mano
              </p>
            </div>
            <Link
              href="/catalogo"
              className="text-sm font-semibold text-orange-500 hover:text-orange-600"
            >
              Ver catálogo completo
            </Link>
          </div>

          {productosTendencia && productosTendencia.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {productosTendencia.map((producto) => (
                <ProductoDestacadoCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
              <p className="text-gray-400">
                Los productos en tendencia se mostrarán aquí una vez seleccionados.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold">Rubros principales</h2>
              <p className="text-gray-500 mt-1">
                Accesos rápidos para explorar el catálogo por categoría
              </p>
            </div>
            {rubros && rubros.length > 0 ? (
              <div className="flex flex-wrap gap-3 md:justify-end">
                {rubros.map((rubro) => (
                  <Link
                    key={rubro.id}
                    href={`/catalogo?rubro=${rubro.id}`}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-colors"
                  >
                    {rubro.nombre}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                Los rubros se mostrarán aquí una vez cargados.
              </p>
            )}
          </div>
          <div className="mt-8">
            <Link
              href="/catalogo"
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Ver catálogo completo
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "Stock",
                title: "Amplio stock",
                desc: "Gran variedad de productos disponibles para entrega inmediata.",
              },
              {
                icon: "Asesoría",
                title: "Atención personalizada",
                desc: "Te asesoramos para encontrar el producto que necesitás.",
              },
              {
                icon: "Envíos",
                title: "Envíos",
                desc: "Despachamos a todo el país con los mejores transportes.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-bold uppercase text-orange-500 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-500 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Buscás un proveedor confiable?
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Contactanos y te asesoramos sin compromiso.
          </p>
          <Link
            href="/contacto"
            className="bg-white text-orange-500 hover:bg-orange-50 px-8 py-4 rounded-lg font-bold text-lg transition-colors inline-block"
          >
            Contactanos ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
