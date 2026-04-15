import { createClient } from "@/lib/supabase-server";

export default async function ConsultasPage() {
  const supabase = await createClient();
  const { data: consultas } = await supabase
    .from("contactos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Consultas recibidas</h1>
        <span className="bg-orange-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
          {consultas?.length ?? 0} total
        </span>
      </div>

      {!consultas || consultas.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm">
          <p className="text-lg">Todavía no hay consultas recibidas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {consultas.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{c.nombre}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                    {c.empresa && <span>🏢 {c.empresa}</span>}
                    <span>✉️ {c.email}</span>
                    {c.telefono && <span>📞 {c.telefono}</span>}
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(c.created_at).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-line border-t pt-3">{c.mensaje}</p>
              <div className="flex gap-3 mt-4">
                <a
                  href={`mailto:${c.email}`}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                >
                  Responder por email →
                </a>
                {c.telefono && (
                  <a
                    href={`https://wa.me/${c.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${c.nombre}, te contactamos desde Bulonera Agroindustrial en respuesta a tu consulta.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Responder por WhatsApp →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
