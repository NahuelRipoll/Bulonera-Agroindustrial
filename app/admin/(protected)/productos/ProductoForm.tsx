"use client";

import { useTransition, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { crearProducto, actualizarProducto } from "./actions";

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
  activo: boolean;
}

interface Props {
  rubros: Rubro[];
  producto?: Producto;
}

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width >= height) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file); // si no mejora, usar original
            return;
          }
          resolve(
            new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
              type: "image/jpeg",
            })
          );
        },
        "image/jpeg",
        0.82
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file); // fallback al original si algo falla
    };
    img.src = url;
  });
}

export default function ProductoForm({ rubros, producto }: Props) {
  const [isPending, startTransition] = useTransition();
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const imagen = formData.get("imagen") as File;
    if (imagen && imagen.size > 0) {
      setCompressionInfo("Comprimiendo imagen...");
      const originalKB = Math.round(imagen.size / 1024);
      const compressed = await compressImage(imagen);
      const compressedKB = Math.round(compressed.size / 1024);
      const saving = Math.round((1 - compressed.size / imagen.size) * 100);

      if (saving > 5) {
        setCompressionInfo(
          `Imagen comprimida: ${originalKB} KB → ${compressedKB} KB (−${saving}%)`
        );
      } else {
        setCompressionInfo(null);
      }
      formData.set("imagen", compressed, compressed.name);
    }

    startTransition(async () => {
      if (producto) {
        await actualizarProducto(formData);
      } else {
        await crearProducto(formData);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      {producto && <input type="hidden" name="id" value={producto.id} />}
      {producto && (
        <input type="hidden" name="imagen_actual" value={producto.imagen_url || ""} />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del producto *
        </label>
        <input
          name="nombre"
          required
          defaultValue={producto?.nombre}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          placeholder="Ej: Bulón hexagonal 5/16"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rubro
        </label>
        <select
          name="rubro_id"
          defaultValue={producto?.rubro_id || ""}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
        >
          <option value="">Sin rubro</option>
          {rubros.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          rows={4}
          defaultValue={producto?.descripcion || ""}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
          placeholder="Descripción general del producto..."
        />
      </div>

      <div>
        {producto?.imagen_url && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Imagen actual</p>
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
              <Image
                src={producto.imagen_url}
                alt={producto.nombre}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {producto?.imagen_url ? "Reemplazar imagen" : "Imagen"}
        </label>
        <input
          name="imagen"
          type="file"
          accept="image/*"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
        />
        <p className="text-xs text-gray-400 mt-1">
          JPG, PNG o WEBP. Se comprime automáticamente antes de subirse.
        </p>
        {compressionInfo && (
          <p className="text-xs text-green-600 mt-1">{compressionInfo}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="activo"
          id="activo"
          defaultChecked={producto ? producto.activo : true}
          className="w-4 h-4 accent-orange-500"
        />
        <label htmlFor="activo" className="text-sm font-medium text-gray-700">
          Producto activo (visible en el catálogo)
        </label>
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {isPending
            ? "Guardando..."
            : producto
            ? "Guardar cambios"
            : "Guardar producto"}
        </button>
        <Link
          href="/admin/productos"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
