"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function extractStoragePath(url: string): string | null {
  const marker = "/storage/v1/object/public/imagenes/";
  const idx = url.indexOf(marker);
  return idx !== -1 ? url.slice(idx + marker.length) : null;
}

export async function crearProducto(formData: FormData) {
  const supabase = await requireAuth();

  const nombre = formData.get("nombre") as string;
  const descripcion = formData.get("descripcion") as string;
  const rubro_id = formData.get("rubro_id") as string;
  const activo = formData.get("activo") === "on";
  const imagen = formData.get("imagen") as File;

  let imagen_url: string | null = null;

  if (imagen && imagen.size > 0) {
    const ext = imagen.name.split(".").pop();
    const path = `productos/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("imagenes")
      .upload(path, imagen, { contentType: imagen.type });

    if (!error && data) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("imagenes").getPublicUrl(data.path);
      imagen_url = publicUrl;
    }
  }

  await supabase.from("productos").insert({
    nombre,
    descripcion: descripcion || null,
    rubro_id: rubro_id || null,
    activo,
    imagen_url,
  });

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  revalidatePath("/");
  redirect("/admin/productos");
}

export async function actualizarProducto(formData: FormData) {
  const supabase = await requireAuth();

  const id = formData.get("id") as string;
  const nombre = formData.get("nombre") as string;
  const descripcion = formData.get("descripcion") as string;
  const rubro_id = formData.get("rubro_id") as string;
  const activo = formData.get("activo") === "on";
  const imagen = formData.get("imagen") as File;
  const imagen_actual = formData.get("imagen_actual") as string;

  let imagen_url: string | null = imagen_actual || null;

  if (imagen && imagen.size > 0) {
    if (imagen_actual) {
      const path = extractStoragePath(imagen_actual);
      if (path) await supabase.storage.from("imagenes").remove([path]);
    }

    const ext = imagen.name.split(".").pop();
    const uploadPath = `productos/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("imagenes")
      .upload(uploadPath, imagen, { contentType: imagen.type });

    if (!error && data) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("imagenes").getPublicUrl(data.path);
      imagen_url = publicUrl;
    }
  }

  await supabase
    .from("productos")
    .update({
      nombre,
      descripcion: descripcion || null,
      rubro_id: rubro_id || null,
      activo,
      imagen_url,
    })
    .eq("id", id);

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  redirect("/admin/productos");
}

export async function eliminarProducto(id: string, imagen_url: string) {
  const supabase = await requireAuth();

  if (imagen_url) {
    const path = extractStoragePath(imagen_url);
    if (path) await supabase.storage.from("imagenes").remove([path]);
  }

  await supabase.from("productos").delete().eq("id", id);

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  revalidatePath("/");
}

export async function eliminarProductos(
  ids: string[],
  imagen_urls: string[]
) {
  const supabase = await requireAuth();

  const paths = imagen_urls
    .map(extractStoragePath)
    .filter((p): p is string => p !== null);

  if (paths.length > 0) {
    await supabase.storage.from("imagenes").remove(paths);
  }

  await supabase.from("productos").delete().in("id", ids);

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  revalidatePath("/");
}
