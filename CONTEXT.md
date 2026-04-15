# Contexto del Proyecto — Bulonera Agroindustrial (Catálogo Virtual)

## Stack
- **Framework:** Next.js 16.2.3 — App Router, Server Actions, Middleware
- **Lenguaje:** TypeScript 5
- **UI:** React 19.2.4 + Tailwind CSS 4
- **Base de datos / Auth / Storage:** Supabase (PostgreSQL)
- **Email:** Resend (`consultas@bagroindustrial.com` → `bulonera@bagroindustrial.com`)
- **IMPORTANTE:** Leer `node_modules/next/dist/docs/` antes de escribir código Next.js (ver AGENTS.md)

## Negocio
Catálogo B2B de productos agroindustriales. Sin carrito ni precios públicos. El CTA principal es consultar por WhatsApp al `5492634564130`.

---

## Estructura de carpetas

```
app/
  page.tsx                    ← Home: hero + rubros destacados + beneficios
  layout.tsx                  ← Root: Navbar + Footer + WhatsAppButton
  catalogo/
    page.tsx                  ← Server: carga datos + SEO
    CatalogoCliente.tsx       ← Client: filtros, búsqueda, paginación (12/pág)
  nosotros/page.tsx
  contacto/
    page.tsx
    ContactoForm.tsx          ← Client: fetch a /api/contacto
  api/contacto/route.ts       ← POST: guarda en DB + envía email
  admin/
    login/page.tsx            ← Supabase email/password auth
    (protected)/              ← Protegido por middleware (proxy.ts)
      layout.tsx              ← Admin layout con AdminNav
      dashboard/page.tsx      ← Stats
      productos/              ← CRUD productos
      rubros/                 ← CRUD rubros/categorías
      consultas/              ← Ver consultas recibidas
components/
  Navbar.tsx                  ← Oculto en /admin
  Footer.tsx
  AdminNav.tsx                ← Sidebar admin
  RubroCard.tsx               ← Card de categoría
  WhatsAppButton.tsx          ← FAB flotante, oculto en /admin
  DeleteButton.tsx            ← Botón con confirmación
lib/
  supabase-server.ts          ← Cliente SSR (cookies)
  supabase-browser.ts         ← Cliente browser
  supabase-admin.ts           ← Cliente admin (SECRET_KEY)
proxy.ts                      ← Middleware: protege /admin/*
```

---

## Base de datos (Supabase)

| Tabla | Campos clave |
|-------|-------------|
| `rubros` | id, nombre, descripcion, imagen_url, orden, destacado (bool) |
| `productos` | id, nombre, descripcion, rubro_id (FK), imagen_url, activo (bool) |
| `contactos` | id, nombre, empresa, email, telefono, mensaje, created_at |

**Storage bucket:** `imagenes` → `/productos/` y `/rubros/`

---

## Variables de entorno (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY          ← solo server-side
RESEND_API_KEY
```

---

## Patrones del proyecto

- **Mutaciones admin:** Server Actions con FormData (no useState, no fetch)
- **Formulario de contacto:** Client component con `fetch()` a `/api/contacto`
- **Invalidación de caché:** `revalidatePath()` en acciones que modifican datos
- **Imágenes:** `next/image` + Supabase CDN; fallback = Logo.png con opacity-20
- **Auth:** Middleware verifica sesión con `supabase.auth.getUser()`
- **WhatsApp links:** `https://wa.me/PHONE?text=MESSAGE` (preescrito)
- **Rubros destacados:** máximo 6 en homepage (campo `destacado`)
- **Colores:** Negro (#0a0a0a), Naranja (orange-500), Blanco; español es-AR
