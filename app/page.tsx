import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import RubroCard from "@/components/RubroCard";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: rubros } = await supabase
    .from("rubros")
    .select("*")
    .eq("destacado", true)
    .order("orden")
    .limit(6);

  return (
    <div>
      {/* Hero */}
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

      {/* Rubros */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            Nuestros rubros
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Encontrá lo que necesitás para tu campo o industria
          </p>
          {rubros && rubros.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {rubros.map((rubro) => (
                <RubroCard key={rubro.id} rubro={rubro} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              Los rubros se mostrarán aquí una vez cargados.
            </p>
          )}
          <div className="text-center mt-12">
            <Link
              href="/catalogo"
              className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-block"
            >
              Ver catálogo completo
            </Link>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏭",
                title: "Amplio stock",
                desc: "Gran variedad de productos disponibles para entrega inmediata.",
              },
              {
                icon: "🤝",
                title: "Atención personalizada",
                desc: "Te asesoramos para encontrar el producto que necesitás.",
              },
              {
                icon: "🚚",
                title: "Envíos",
                desc: "Despachamos a todo el país con los mejores transportes.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
