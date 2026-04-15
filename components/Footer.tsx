"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-black text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image
              src="/Logo.png"
              alt="Logo"
              width={140}
              height={48}
              className="h-10 w-auto object-contain mb-3"
            />
            <p className="text-sm">
              Tu proveedor de confianza en bulonería, herramientas y máquinas
              para el sector agroindustrial. Rodeo del Medio, Maipú, Mendoza.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-orange-500 transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-orange-500 transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-orange-500 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 Lateral Norte Km 1023, Acceso Este, Rodeo del Medio, Maipú, Mendoza</li>
              <li>📞 2634564130</li>
              <li>✉️ bulonera@bagroindustrial.com</li>
              <li>🕐 Lun–Vie 8:30–13:00 / 15:00–19:00</li>
              <li>🕐 Sáb 8:30–13:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Bulonera Agroindustrial. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
