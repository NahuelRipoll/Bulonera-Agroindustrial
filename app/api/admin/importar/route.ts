import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

type ProductoJSON = {
  nombre?: string;
  descripcion?: string;
  rubro?: string;
  activo?: boolean | string;
  imagen?: string;
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let productos: ProductoJSON[];

  try {
    const body = await request.json();
    if (!Array.isArray(body)) throw new Error("El JSON debe ser un array");
    productos = body;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (productos.length === 0) {
    return NextResponse.json({ error: "El array está vacío" }, { status: 400 });
  }

  const { data: rubros } = await supabase.from("rubros").select("id, nombre");
  const rubroMap = new Map(
    rubros?.map((r) => [r.nombre.toLowerCase().trim(), r.id]) ?? []
  );

  const { data: existentes } = await supabase.from("productos").select("nombre");
  const nombresExistentes = new Set(
    existentes?.map((p) => p.nombre.toLowerCase().trim()) ?? []
  );

  const results: { nombre: string; ok: boolean; error?: string }[] = [];

  for (const producto of productos) {
    const nombre = (producto.nombre ?? "").trim();

    if (!nombre) {
      results.push({ nombre: "(sin nombre)", ok: false, error: "Nombre vacío" });
      continue;
    }

    if (nombresExistentes.has(nombre.toLowerCase().trim())) {
      results.push({ nombre, ok: false, error: "Ya existe" });
      continue;
    }

    try {
      const rubroNombre = (producto.rubro ?? "").toLowerCase().trim();
      const rubro_id = rubroNombre ? (rubroMap.get(rubroNombre) ?? null) : null;

      const activoRaw = producto.activo;
      const activo =
        activoRaw === true ||
        (typeof activoRaw === "string" &&
          ["si", "sí", "true", "1", "yes"].includes(activoRaw.toLowerCase().trim()));

      const imagen_url = (producto.imagen ?? "").trim() || null;

      const { error: insertError } = await supabase.from("productos").insert({
        nombre,
        descripcion: (producto.descripcion ?? "").trim() || null,
        rubro_id,
        activo,
        imagen_url,
      });

      if (insertError) throw new Error(insertError.message);

      results.push({ nombre, ok: true });
    } catch (err) {
      results.push({ nombre, ok: false, error: String(err) });
    }
  }

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  revalidatePath("/");

  return NextResponse.json({ results });
}
