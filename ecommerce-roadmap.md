# Roadmap: Conversión a E-commerce

## Estado actual del sitio
- Catálogo B2B con filtros, búsqueda y paginación
- Panel admin: productos, rubros, consultas
- Autenticación via Supabase Auth (hoy solo para admin)
- Base de datos Supabase PostgreSQL
- Stack: Next.js + Supabase + Tailwind

## Lo que ya está resuelto
- Base de datos lista (solo agregar campos `precio` y `stock`)
- Catálogo con filtros funcional
- Panel admin funcional
- Autenticación disponible (puede extenderse a clientes)

## Lo que hay que construir

| Pieza                                  | Complejidad  |
|----------------------------------------|--------------|
| Agregar precio y stock a productos     | Baja         |
| Carrito de compras (localStorage)      | Media        |
| Cuentas de clientes (registro/login)   | Media        |
| Proceso de checkout                    | Media        |
| Integración con MercadoPago            | Media-Alta   |
| Gestión de pedidos en el admin         | Media        |
| Emails de confirmación                 | Baja         |

## Punto más complejo: MercadoPago
- Tiene su propio flujo: Checkout Pro o API de pagos directa
- Usa webhooks para confirmar pagos
- Requiere cuenta vendedor verificada en Argentina
- Bien documentado, compatible con Next.js sin problemas

## Preguntas a definir antes de encararlo
1. ¿Se necesitan cuentas de clientes con historial de pedidos?
2. ¿Control de stock en tiempo real?
3. ¿Integración con correos/logística para envíos?

Estas respuestas determinan si el alcance es liviano o más robusto.
