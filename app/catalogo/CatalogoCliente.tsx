"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

// Placeholder gris 1×1px para imágenes remotas mientras cargan
const BLUR_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

const PHONE_WA = "5492634564130";
const ITEMS_PER_PAGE = 12;

interface Rubro {
  id: string;
  nombre: string;
}

interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
  rubro_id: string | null;
  rubros: { nombre: string } | null;
}

interface Props {
  rubros: Rubro[];
  productos: Producto[];
}

export default function CatalogoCliente({ rubros, productos }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filtros derivados de la URL — compartibles y navegables
  const rubroSeleccionado = searchParams.get("rubro");
  const pagina = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  // Búsqueda local con debounce (no va a la URL para no contaminar el historial)
  const [busqueda, setBusqueda] = useState("");
  const [busquedaDeferida, setBusquedaDeferida] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Actualiza el valor de búsqueda usado para filtrar con 300ms de debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setBusquedaDeferida(busqueda);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [busqueda]);

  function handleRubroChange(rubroId: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (rubroId) {
      params.set("rubro", rubroId);
    } else {
      params.delete("rubro");
    }
    params.delete("page"); // Siempre volver a página 1 al cambiar rubro
    router.push(`/catalogo?${params.toString()}`);
    setSidebarOpen(false);
  }

  function handlePageChange(nueva: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nueva === 1) {
      params.delete("page");
    } else {
      params.set("page", String(nueva));
    }
    router.push(`/catalogo?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function limpiarFiltros() {
    setBusqueda("");
    setBusquedaDeferida("");
    router.push("/catalogo");
  }

  const productosFiltrados = productos.filter((p) => {
    const matchRubro =
      !rubroSeleccionado || p.rubro_id === rubroSeleccionado;
    const matchBusqueda =
      !busquedaDeferida ||
      p.nombre.toLowerCase().includes(busquedaDeferida.toLowerCase()) ||
      (p.descripcion || "").toLowerCase().includes(busquedaDeferida.toLowerCase());
    return matchRubro && matchBusqueda;
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE);
  // Clampear por si los filtros reducen el total de páginas
  const paginaEfectiva = Math.min(pagina, Math.max(1, totalPaginas));
  const productosPagina = productosFiltrados.slice(
    (paginaEfectiva - 1) * ITEMS_PER_PAGE,
    paginaEfectiva * ITEMS_PER_PAGE
  );

  const rubroActual = rubros.find((r) => r.id === rubroSeleccionado);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Buscador */}
      <div className="mb-6 flex gap-3 items-center">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-96 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
        <button
          className="md:hidden bg-black text-white px-4 py-3 rounded-lg text-sm font-medium"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          Rubros
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } md:block md:w-56 flex-shrink-0`}
        >
          <h2 className="font-bold text-lg mb-4">Rubros</h2>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleRubroChange(null)}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  !rubroSeleccionado
                    ? "bg-orange-500 text-white font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                Todos
              </button>
            </li>
            {rubros.map((rubro) => (
              <li key={rubro.id}>
                <button
                  onClick={() => handleRubroChange(rubro.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                    rubroSeleccionado === rubro.id
                      ? "bg-orange-500 text-white font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {rubro.nombre}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Productos */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm">
              {rubroActual && (
                <span className="font-semibold text-gray-700">
                  {rubroActual.nombre} —{" "}
                </span>
              )}
              {productosFiltrados.length} producto
              {productosFiltrados.length !== 1 ? "s" : ""} encontrado
              {productosFiltrados.length !== 1 ? "s" : ""}
            </p>
            {(rubroSeleccionado || busqueda) && (
              <button
                onClick={limpiarFiltros}
                className="text-sm text-orange-500 hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xl text-gray-600 mb-2">No se encontraron productos</p>
              <p className="text-sm text-gray-400 mb-6">
                ¿No encontrás lo que buscás? Consultanos directamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/${PHONE_WA}?text=${encodeURIComponent("Hola, estoy buscando un producto que no encuentro en el catálogo.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Consultar por WhatsApp
                </a>
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm"
                >
                  Ir a contacto
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosPagina.map((producto) => {
                  const waMsg = encodeURIComponent(
                    `Hola, me interesa el producto: ${producto.nombre}`
                  );
                  return (
                    <div
                      key={producto.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                    >
                      <div className="aspect-square bg-gray-50 relative">
                        {producto.imagen_url ? (
                          <Image
                            src={producto.imagen_url}
                            alt={producto.nombre}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            placeholder="blur"
                            blurDataURL={BLUR_PLACEHOLDER}
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image
                              src="/Logo.png"
                              alt="Bulonera Agroindustrial"
                              width={100}
                              height={100}
                              className="object-contain opacity-20"
                            />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        {producto.rubros && (
                          <span className="text-xs text-orange-500 font-semibold uppercase tracking-wide">
                            {producto.rubros.nombre}
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-900 mt-1">
                          {producto.nombre}
                        </h3>
                        {producto.descripcion && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-3 flex-1">
                            {producto.descripcion}
                          </p>
                        )}
                        <a
                          href={`https://wa.me/${PHONE_WA}?text=${waMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                          Consultar
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA consulta */}
              <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-gray-700 font-medium mb-1">¿No encontrás lo que buscás?</p>
                <p className="text-sm text-gray-500 mb-4">
                  Consultanos directamente y te ayudamos a encontrarlo.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/${PHONE_WA}?text=${encodeURIComponent("Hola, estoy buscando un producto que no encuentro en el catálogo.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors text-sm"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Consultar por WhatsApp
                  </a>
                  <Link
                    href="/contacto"
                    className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Ir a contacto
                  </Link>
                </div>
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => handlePageChange(paginaEfectiva - 1)}
                    disabled={paginaEfectiva === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-100 transition-colors"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm text-gray-600 px-2">
                    Página {paginaEfectiva} de {totalPaginas}
                  </span>
                  <button
                    onClick={() => handlePageChange(paginaEfectiva + 1)}
                    disabled={paginaEfectiva === totalPaginas}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-100 transition-colors"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
