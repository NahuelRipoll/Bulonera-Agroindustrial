import Image from "next/image";
import Link from "next/link";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
  rubros: { nombre: string } | { nombre: string }[] | null;
}

function getRubroNombre(rubros: Producto["rubros"]) {
  if (Array.isArray(rubros)) return rubros[0]?.nombre ?? null;
  return rubros?.nombre ?? null;
}

export default function ProductoDestacadoCard({
  producto,
}: {
  producto: Producto;
}) {
  const rubroNombre = getRubroNombre(producto.rubros);

  return (
    <Link
      href="/catalogo"
      className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-orange-500 hover:shadow-md transition-all flex flex-col"
    >
      <div className="aspect-square bg-gray-50 relative">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src="/Logo.png"
              alt="Bulonera Agroindustrial"
              width={80}
              height={80}
              className="object-contain opacity-20"
            />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        {rubroNombre && (
          <span className="text-xs text-orange-500 font-semibold uppercase">
            {rubroNombre}
          </span>
        )}
        <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-orange-500 transition-colors">
          {producto.nombre}
        </h3>
        {producto.descripcion && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {producto.descripcion}
          </p>
        )}
      </div>
    </Link>
  );
}
