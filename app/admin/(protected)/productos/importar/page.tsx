"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

type ProductoJSON = {
  nombre?: string;
  descripcion?: string;
  rubro?: string;
  activo?: boolean | string;
  imagen?: string;
};

type FilaResultado = { nombre: string; ok: boolean; error?: string };

const TEMPLATE_JSON: ProductoJSON[] = [
  {
    nombre: "Bulón hexagonal 5/16",
    descripcion: "Resistente al torque, galvanizado",
    rubro: "Bulones",
    activo: true,
    imagen: "https://ejemplo.com/bulon.jpg",
  },
  {
    nombre: "Tuerca M8",
    descripcion: "",
    rubro: "Tuercas",
    activo: true,
    imagen: "",
  },
];

export default function ImportarProductosPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [productos, setProductos] = useState<ProductoJSON[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [resultados, setResultados] = useState<FilaResultado[] | null>(null);
  const [jsonText, setJsonText] = useState<string>("");

  async function descargarRubros() {
    const supabase = createClient();
    const { data: rubros } = await supabase
      .from("rubros")
      .select("nombre")
      .order("orden");

    if (!rubros?.length) return;

    const texto = rubros.map((r) => r.nombre).join("\n");
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rubros.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function descargarTemplate() {
    const blob = new Blob([JSON.stringify(TEMPLATE_JSON, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_productos.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFile(file: File) {
    setParseError(null);
    setProductos(null);
    setResultados(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonText(text);
      try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          setParseError("El archivo debe contener un array JSON [ ... ]");
          return;
        }
        setProductos(parsed);
      } catch {
        setParseError("El archivo no es un JSON válido.");
      }
    };
    reader.readAsText(file);
  }

  async function handleImportar() {
    if (!productos?.length) return;
    setCargando(true);
    setResultados(null);

    const res = await fetch("/api/admin/importar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonText,
    });

    const data = await res.json();
    setResultados(data.results ?? []);
    setCargando(false);
  }

  const exitosos = resultados?.filter((r) => r.ok).length ?? 0;
  const fallidos = resultados?.filter((r) => !r.ok).length ?? 0;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/productos"
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold">Importar productos</h1>
      </div>

      {/* Instrucciones */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-sm text-orange-800">
        <p className="font-semibold mb-2">Cómo funciona</p>
        <ol className="list-decimal list-inside space-y-1 mb-3">
          <li>Descargá el template y completalo con tus productos.</li>
          <li>
            El campo <code className="bg-orange-100 px-1 rounded">imagen</code>{" "}
            acepta una URL pública o puede dejarse vacío.
          </li>
          <li>Subí el archivo JSON y revisá la vista previa.</li>
          <li>Hacé clic en Importar.</li>
        </ol>
        <div className="flex items-center gap-4">
          <button
            onClick={descargarTemplate}
            className="text-orange-600 underline hover:text-orange-800 font-medium"
          >
            Descargar template JSON
          </button>
          <span className="text-orange-300">|</span>
          <button
            onClick={descargarRubros}
            className="text-orange-600 underline hover:text-orange-800 font-medium"
          >
            Descargar listado de rubros
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* File input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Archivo JSON <span className="text-red-500">*</span>
          </label>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
          />
        </div>

        {parseError && (
          <p className="text-sm text-red-500">{parseError}</p>
        )}

        {/* Preview */}
        {productos && productos.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Vista previa — {productos.length} producto
              {productos.length !== 1 ? "s" : ""}
            </p>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["nombre", "descripcion", "rubro", "activo", "imagen"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productos.slice(0, 10).map((p, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-medium text-gray-900 max-w-[160px] truncate">
                        {p.nombre || <span className="text-red-400">vacío</span>}
                      </td>
                      <td className="px-3 py-2 text-gray-500 max-w-[160px] truncate">
                        {p.descripcion || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {p.rubro || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            p.activo === true || p.activo === "si"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {p.activo === true || p.activo === "si"
                            ? "Activo"
                            : "Oculto"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-400 max-w-[160px] truncate text-xs">
                        {p.imagen || <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {productos.length > 10 && (
                <p className="text-xs text-gray-400 px-3 py-2 border-t">
                  ... y {productos.length - 10} más
                </p>
              )}
            </div>
          </div>
        )}

        {productos?.length === 0 && (
          <p className="text-sm text-red-500">El archivo JSON está vacío.</p>
        )}

        {/* Botón importar */}
        {productos && productos.length > 0 && !resultados && (
          <button
            onClick={handleImportar}
            disabled={cargando}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {cargando
              ? "Importando..."
              : `Importar ${productos.length} producto${productos.length !== 1 ? "s" : ""}`}
          </button>
        )}
      </div>

      {/* Resultados */}
      {resultados && (
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-green-600 font-semibold">
              {exitosos} importado{exitosos !== 1 ? "s" : ""}
            </span>
            {fallidos > 0 && (
              <span className="text-red-500 font-semibold">
                {fallidos} con error
              </span>
            )}
          </div>
          <div className="space-y-2">
            {resultados.map((r, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg ${
                  r.ok
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <span>{r.ok ? "✓" : "✗"}</span>
                <span className="font-medium">{r.nombre}</span>
                {r.error && (
                  <span className="text-xs opacity-70">— {r.error}</span>
                )}
              </div>
            ))}
          </div>
          {exitosos > 0 && (
            <button
              onClick={() => router.push("/admin/productos")}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm"
            >
              Ver productos
            </button>
          )}
        </div>
      )}
    </div>
  );
}
