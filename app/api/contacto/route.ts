import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { nombre, empresa, email, telefono, mensaje } = await request.json();

    if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const datos = {
      nombre: nombre.trim(),
      empresa: empresa?.trim() || null,
      email: email.trim(),
      telefono: telefono?.trim() || null,
      mensaje: mensaje.trim(),
    };

    // Guardar en Supabase
    const supabase = createAdminClient();
    const { error } = await supabase.from("contactos").insert(datos);
    if (error) throw error;

    // Enviar email de notificación
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Catálogo Web <consultas@bagroindustrial.com>",
      to: "bulonera@bagroindustrial.com",
      replyTo: datos.email,
      subject: `Nueva consulta de ${datos.nombre}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Nueva consulta desde el catálogo</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Nombre</td>
              <td style="padding: 8px 0; color: #111827;">${datos.nombre}</td>
            </tr>
            ${datos.empresa ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Empresa</td>
              <td style="padding: 8px 0; color: #111827;">${datos.empresa}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email</td>
              <td style="padding: 8px 0; color: #111827;"><a href="mailto:${datos.email}">${datos.email}</a></td>
            </tr>
            ${datos.telefono ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Teléfono</td>
              <td style="padding: 8px 0; color: #111827;">${datos.telefono}</td>
            </tr>` : ""}
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #f97316;">
            <p style="font-weight: bold; color: #374151; margin: 0 0 8px;">Mensaje</p>
            <p style="color: #111827; margin: 0; white-space: pre-line;">${datos.mensaje}</p>
          </div>
          <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
            Podés responder directamente a este email — llegará a ${datos.email}
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Error Resend:", emailError);
    } else {
      console.log("Email enviado OK, id:", emailData?.id);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error en /api/contacto:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
