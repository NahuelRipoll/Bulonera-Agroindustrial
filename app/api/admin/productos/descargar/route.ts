import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

type ProductoExportado = {
  nombre: string;
  descripcion: string | null;
  rubro: string;
  activo: boolean;
  imagen: string;
};

type ProductoRow = {
  nombre: string;
  descripcion: string | null;
  activo: boolean | null;
  imagen_url: string | null;
  rubros: { nombre: string } | { nombre: string }[] | null;
};

function getRubroNombre(rubros: ProductoRow["rubros"]) {
  if (Array.isArray(rubros)) return rubros[0]?.nombre ?? "";
  return rubros?.nombre ?? "";
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("productos")
    .select("nombre, descripcion, activo, imagen_url, rubros(nombre)")
    .order("nombre", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "No se pudo generar el JSON" },
      { status: 500 }
    );
  }

  const productos: ProductoExportado[] = ((data ?? []) as ProductoRow[]).map(
    (producto) => ({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      rubro: getRubroNombre(producto.rubros),
      activo: producto.activo ?? false,
      imagen: producto.imagen_url ?? "",
    })
  );

  const fecha = new Date().toISOString().slice(0, 10);

  return new NextResponse(JSON.stringify(productos, null, 2), {
    headers: {
      "Content-Disposition": `attachment; filename="productos-${fecha}.json"`,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
