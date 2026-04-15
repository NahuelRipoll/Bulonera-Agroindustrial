import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Bulonera Agroindustrial",
  description:
    "Conocé quiénes somos. Bulonería especializada en el sector agroindustrial en Mendoza, Argentina, con más de 1000 productos disponibles.",
};

export default function NosotrosPage() {
  return (
    <div>
      <section className="bg-black text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Sobre nosotros</h1>
          <p className="text-gray-400 mt-2">Conocé quiénes somos</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Tu proveedor de confianza en el sector{" "}
                <span className="text-orange-500">agroindustrial</span>
              </h2>
              <p className="text-gray-600 mb-4">
                Somos una bulonería especializada en el sector agroindustrial,
                con un amplio stock de productos para atender las necesidades de
                empresas agropecuarias e industriales.
              </p>
              <p className="text-gray-600 mb-4">
                Contamos con bulonería en general, herramientas manuales y
                máquinas eléctricas y a batería de las mejores marcas del
                mercado.
              </p>
              <p className="text-gray-600">
                Nuestro objetivo es brindar la mejor atención y los mejores
                productos para que tu trabajo sea más eficiente y productivo.
              </p>
            </div>
            <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center text-gray-400">
              <div className="text-center p-8">
                <svg
                  className="w-24 h-24 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <p className="text-sm">Foto del local</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { valor: "+1000", label: "Productos" },
              { valor: "3", label: "Años en el rubro" },
              { valor: "9", label: "Rubros" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 bg-black text-white rounded-xl"
              >
                <div className="text-3xl font-bold text-orange-500">
                  {stat.valor}
                </div>
                <div className="text-sm mt-1 text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
