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

export async function crearRubro(formData: FormData) {
  const supabase = await requireAuth();
  const nombre = formData.get("nombre") as string;
  if (!nombre?.trim()) return;

  await supabase.from("rubros").insert({ nombre: nombre.trim() });

  revalidatePath("/admin/rubros");
  revalidatePath("/catalogo");
  revalidatePath("/");
}

export async function editarRubro(formData: FormData) {
  const supabase = await requireAuth();

  const id = formData.get("id") as string;
  const nombre = formData.get("nombre") as string;
  const descripcion = formData.get("descripcion") as string;
  const destacado = formData.get("destacado") === "on";
  const imagen = formData.get("imagen") as File;
  const imagen_actual = formData.get("imagen_actual") as string;

  let imagen_url: string | null = imagen_actual || null;

  if (imagen && imagen.size > 0) {
    if (imagen_actual) {
      const path = extractStoragePath(imagen_actual);
      if (path) await supabase.storage.from("imagenes").remove([path]);
    }

    const ext = imagen.name.split(".").pop();
    const uploadPath = `rubros/${Date.now()}.${ext}`;
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
    .from("rubros")
    .update({
      nombre,
      descripcion: descripcion || null,
      imagen_url,
      destacado,
    })
    .eq("id", id);

  revalidatePath("/admin/rubros");
  revalidatePath("/catalogo");
  revalidatePath("/");
  redirect("/admin/rubros");
}

export async function toggleDestacado(id: string, valorActual: boolean) {
  const supabase = await requireAuth();
  await supabase
    .from("rubros")
    .update({ destacado: !valorActual })
    .eq("id", id);

  revalidatePath("/admin/rubros");
  revalidatePath("/");
}

export async function eliminarRubro(id: string) {
  const supabase = await requireAuth();
  await supabase.from("rubros").delete().eq("id", id);

  revalidatePath("/admin/rubros");
  revalidatePath("/catalogo");
  revalidatePath("/");
}
