# Bulonera Agroindustrial — Catálogo Virtual

Catálogo de productos online para empresa agroindustrial de Mendoza, Argentina. Vende bulones, herramientas y maquinaria eléctrica. El modelo es catálogo + consulta por WhatsApp, sin ecommerce ni carrito de compras. Los precios no se muestran públicamente.

## Stack

- **Next.js 16.2.3** (App Router, Server Actions, Middleware)
- **React 19.2.4**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Supabase** — PostgreSQL + Auth + Storage
- **Resend** — envío de emails de notificación

## Levantar en desarrollo

```bash
npm install
npm run dev
```

Corre en `http://localhost:3000`. Requiere `.env.local` con las variables de entorno.

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
RESEND_API_KEY=...
```

## Estructura del proyecto

```
app/
├── page.tsx                        # Home: hero + rubros destacados + beneficios
├── layout.tsx                      # Layout raíz: Navbar + Footer + WhatsAppButton
├── catalogo/
│   ├── page.tsx                    # Página catálogo (server, carga datos, SEO metadata)
│   └── CatalogoCliente.tsx         # Filtro/búsqueda/paginación client-side
├── nosotros/page.tsx               # Página "Quiénes somos" (con SEO metadata)
├── contacto/
│   ├── page.tsx                    # Server component con SEO metadata
│   └── ContactoForm.tsx            # Formulario de contacto (client component)
├── api/contacto/route.ts           # POST: guarda consulta en Supabase + envía email con Resend
└── admin/
    ├── login/page.tsx              # Login con Supabase Auth
    └── (protected)/                # Route group — protegido por middleware
        ├── layout.tsx              # Layout admin con AdminNav
        ├── dashboard/page.tsx      # Stats: total productos, rubros, consultas
        ├── productos/
        │   ├── page.tsx            # Listado de productos
        │   ├── nuevo/page.tsx      # Formulario crear producto
        │   ├── [id]/editar/page.tsx# Formulario editar producto
        │   └── actions.ts          # Server Actions: crearProducto, actualizarProducto, eliminarProducto
        ├── rubros/
        │   ├── page.tsx            # Listado de rubros
        │   ├── [id]/page.tsx       # Formulario editar rubro
        │   └── actions.ts          # Server Actions: crearRubro, editarRubro, eliminarRubro, toggleDestacado
        └── consultas/
            └── page.tsx            # Lista de consultas recibidas con acciones de respuesta

components/
├── Navbar.tsx          # Barra de navegación (se oculta en rutas /admin)
├── Footer.tsx          # Pie con info de la empresa y links
├── AdminNav.tsx        # Navegación del panel admin: Dashboard, Productos, Rubros, Consultas + logout
├── RubroCard.tsx       # Tarjeta visual de categoría (imagen, nombre)
├── WhatsAppButton.tsx  # Botón flotante de WhatsApp (oculto en /admin)
└── DeleteButton.tsx    # Botón de eliminar con diálogo de confirmación

lib/
├── supabase-server.ts  # Cliente Supabase para Server Components (cookies SSR)
├── supabase-browser.ts # Cliente Supabase para Client Components
└── supabase-admin.ts   # Cliente Supabase con SUPABASE_SECRET_KEY (operaciones admin)

proxy.ts                # Middleware Next.js: protege /admin/*, redirige según sesión
```

## Base de datos (Supabase)

### `rubros` — Categorías de productos
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| nombre | text | |
| descripcion | text | Opcional |
| imagen_url | text | URL en Supabase Storage (`/rubros/`) |
| orden | integer | Orden de aparición |
| destacado | boolean | Aparece en home (máximo 6) |
| created_at | timestamp | |

### `productos` — Productos del catálogo
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| nombre | text | |
| descripcion | text | Opcional |
| rubro_id | UUID | FK → rubros.id |
| imagen_url | text | URL en Supabase Storage (`/productos/`) |
| activo | boolean | Visible en catálogo público |
| created_at | timestamp | |

### `contactos` — Consultas recibidas del formulario
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| nombre | text | |
| empresa | text | Opcional |
| email | text | |
| telefono | text | Opcional |
| mensaje | text | |
| created_at | timestamp | |

## Storage (Supabase)

Bucket: `imagenes`
- Imágenes de productos: `/productos/`
- Imágenes de rubros: `/rubros/`

Al reemplazar o eliminar una imagen, el código limpia el archivo anterior del bucket.

## Autenticación

- Supabase Auth (email/password)
- `proxy.ts` intercepta todas las rutas `/admin/*`
  - Sin sesión → redirige a `/admin/login`
  - Con sesión en `/admin/login` → redirige a `/admin/dashboard`

## Email (Resend)

Cuando alguien envía el formulario de contacto, `app/api/contacto/route.ts`:
1. Guarda la consulta en la tabla `contactos` de Supabase
2. Envía un email de notificación a `bulonera@bagroindustrial.com` vía Resend

- **From:** `consultas@bagroindustrial.com` (dominio verificado en Resend)
- **To:** `bulonera@bagroindustrial.com`
- **Reply-To:** email del consultante — se puede responder directo desde el cliente de correo
- Dominio `bagroindustrial.com` verificado en Resend, registrado en Hostinger

## Catálogo público

- Muestra todos los productos activos
- Filtro por rubro (sidebar) + búsqueda por texto en tiempo real
- Paginación: 12 productos por página
- Cada producto tiene botón "Consultar" que abre WhatsApp con el nombre del producto pre-cargado
- Al pie de la grilla aparece siempre un CTA "¿No encontrás lo que buscás?" con acceso a WhatsApp y contacto
- Si no hay resultados, el empty state también ofrece contacto directo
- Imágenes sin foto muestran el logo de la empresa como placeholder

## Funcionalidades del admin

- **Dashboard:** conteo de productos, rubros y consultas recibidas
- **Productos:** CRUD completo — crear, editar, eliminar, toggle activo/inactivo, subida de imágenes
- **Rubros:** CRUD completo — crear, editar, eliminar, toggle destacado (máximo 6 en home)
- **Consultas:** lista de todos los mensajes recibidos con accesos rápidos para responder por email o WhatsApp
- **Importación masiva:** carga de productos en lote desde un archivo `.json`

Todas las mutaciones usan Server Actions y llaman a `revalidatePath` para invalidar caché.

## Importación masiva de productos

Desde `/admin/productos` → **Importar JSON**. El archivo debe ser un array con el siguiente formato:

```json
[
  {
    "nombre": "Bulón hexagonal 5/16",
    "descripcion": "Descripción opcional",
    "rubro": "Bulones",
    "activo": true,
    "imagen": "https://url-publica-de-la-imagen.com/foto.jpg"
  }
]
```

- El campo `rubro` debe coincidir exactamente con un rubro existente. Desde la misma página se puede descargar el listado de rubros.
- El campo `imagen` acepta una URL pública o puede dejarse vacío (`""`).
- Si ya existe un producto con el mismo nombre, se omite (no genera duplicados).
- El template JSON se puede descargar desde la misma página.

## WhatsApp

Número configurado: `5492634564130` (Argentina, Mendoza)
Definido en dos lugares:
- `components/WhatsAppButton.tsx` — botón flotante global
- `app/catalogo/CatalogoCliente.tsx` — constante `PHONE_WA` para botones por producto y CTAs

## SEO

Cada página pública tiene `metadata` propio (title + description):
- `/` — definido en `app/layout.tsx`
- `/catalogo` — en `app/catalogo/page.tsx`
- `/nosotros` — en `app/nosotros/page.tsx`
- `/contacto` — en `app/contacto/page.tsx` (server component wrapper de ContactoForm)

## Decisiones de producto

- **Sin precios visibles** — el catálogo es informativo, los precios se consultan por WhatsApp
- **Sin ecommerce ni carrito** — el modelo es catálogo + consulta directa, apropiado para clientes B2B del sector agroindustrial
- **Imágenes opcionales** — los productos pueden cargarse sin foto

## Mapa de Google Maps

La página `/contacto` incluye un embed de Google Maps apuntando al local. El `src` del iframe se obtiene desde Google Maps → **Compartir → Incorporar un mapa** y se configura en `app/contacto/ContactoForm.tsx`.

## Configuración de imágenes (next.config.ts)

El dominio de Supabase Storage está whitelisteado para que `next/image` optimice las imágenes del CDN. Además se permite cualquier hostname HTTPS para soportar imágenes importadas desde URLs externas.
