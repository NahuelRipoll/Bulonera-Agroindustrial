"use client";

import { useState } from "react";

export default function ContactoForm() {
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    mensaje: "",
  });
  const [estado, setEstado] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEstado("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setEstado("success");
        setForm({ nombre: "", empresa: "", email: "", telefono: "", mensaje: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status >= 500) {
          setErrorMsg(
            "El servidor tuvo un problema. Si el error persiste, contactanos por WhatsApp."
          );
        } else {
          setErrorMsg(data.error || "Verificá los datos e intentá de nuevo.");
        }
        setEstado("error");
      }
    } catch {
      setErrorMsg("Sin conexión. Verificá tu internet e intentá de nuevo.");
      setEstado("error");
    }
  }

  return (
    <div>
      <section className="bg-black text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Contacto</h1>
          <p className="text-gray-400 mt-2">Estamos para ayudarte</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Envianos un mensaje</h2>

            {estado === "success" ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  ¡Mensaje enviado!
                </h3>
                <p className="text-green-700">
                  Nos comunicaremos con vos a la brevedad.
                </p>
                <button
                  onClick={() => setEstado("idle")}
                  className="mt-6 text-orange-500 hover:underline text-sm"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={form.empresa}
                      onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={form.telefono}
                      onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.mensaje}
                    onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                  />
                </div>
                {estado === "error" && errorMsg && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
                    <div>
                      <p className="text-red-700 text-sm">{errorMsg}</p>
                      <button
                        type="button"
                        onClick={() => setEstado("idle")}
                        className="mt-1 text-xs text-orange-500 hover:underline"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={estado === "loading"}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-4 rounded-lg font-semibold transition-colors"
                >
                  {estado === "loading" ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>

          {/* Info de contacto */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Información de contacto</h2>
            <div className="space-y-6">
              {[
                { icon: "📍", label: "Dirección", value: "Lateral Norte Km 1023, Acceso Este\nRodeo del Medio, Maipú, Mendoza" },
                { icon: "📞", label: "Teléfono", value: "2634564130" },
                { icon: "✉️", label: "Email", value: "bulonera@bagroindustrial.com" },
                {
                  icon: "🕐",
                  label: "Horarios",
                  value: "Lunes a Viernes: 8:30 - 13:00 / 15:00 - 19:00\nSábados: 8:30 - 13:00",
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{item.label}</p>
                    <p className="text-gray-600 whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl overflow-hidden h-64 border border-gray-200">
              <iframe
                title="Ubicación Bulonera Agroindustrial"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107085.51716813516!2d-68.7518278381616!3d-32.99263721484042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e6def03396bcd%3A0x1a49901fafffd74d!2sBulonera%20Agroindustrial!5e0!3m2!1ses!2sar!4v1776284598650!5m2!1ses!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
