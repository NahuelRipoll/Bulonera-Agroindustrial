# Modal de Detalle de Producto

**Fecha:** 2026-04-29  
**Estado:** Aprobado

## Objetivo

Permitir que el usuario vea la descripción completa de un producto sin abandonar el catálogo, preservando filtros y posición de scroll.

## Decisiones de diseño

- **Modal** (no página propia): el flujo de navegación del catálogo no se interrumpe. Al cerrar, el usuario vuelve exactamente a donde estaba.
- **Layout vertical**: imagen arriba, información abajo. Funciona igual en mobile y desktop.

## Comportamiento

- Click en cualquier parte de la tarjeta de producto (excepto el botón de WhatsApp) abre el modal.
- El botón de WhatsApp en la tarjeta sigue funcionando de forma independiente (consulta rápida sin abrir el modal).
- El modal se cierra con:
  - Botón ✕ (esquina superior derecha)
  - Click en el fondo oscuro (overlay)
  - Tecla Escape

## Contenido del modal

De arriba a abajo:

1. **Imagen** — tamaño grande, fondo gris claro (`bg-gray-50`), `object-contain` con padding para que no se recorte.
2. **Rubro** — badge en naranja (`text-orange-500`), mayúsculas, igual que en la tarjeta.
3. **Nombre** — completo, en negrita, sin truncar.
4. **Descripción** — texto completo, sin `line-clamp`. Si es larga, el modal hace scroll internamente.
5. **Botón WhatsApp** — verde, con el nombre del producto pre-cargado en el mensaje.

## Implementación

- **Archivo a modificar:** `app/catalogo/CatalogoCliente.tsx` únicamente.
- **Estado:** `const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)`.
- Cuando `productoSeleccionado !== null`, se renderiza el modal como un `div` fijo (`fixed inset-0`) con overlay y el panel centrado.
- El modal se renderiza al final del JSX, fuera del grid de productos.
- Sin librerías externas. Usa `Image` de Next.js y Tailwind, que ya están en el proyecto.
- El `overflow-hidden` que tiene cada tarjeta actualmente no afecta al modal porque este usa `fixed`.

## Lo que NO cambia

- El botón de WhatsApp en cada tarjeta del catálogo permanece igual.
- La descripción truncada (`line-clamp-3`) en la tarjeta permanece como preview.
- Paginación, filtros y búsqueda no se modifican.
