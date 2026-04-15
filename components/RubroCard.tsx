import Link from "next/link";
import Image from "next/image";

interface Rubro {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
}

export default function RubroCard({ rubro }: { rubro: Rubro }) {
  return (
    <Link
      href={`/catalogo?rubro=${rubro.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-orange-500 hover:shadow-lg transition-all"
    >
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {rubro.imagen_url ? (
          <Image
            src={rubro.imagen_url}
            alt={rubro.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
          {rubro.nombre}
        </h3>
        {rubro.descripcion && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {rubro.descripcion}
          </p>
        )}
      </div>
    </Link>
  );
}
