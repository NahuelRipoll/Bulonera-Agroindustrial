alter table public.productos
  add column if not exists tendencia boolean not null default false,
  add column if not exists tendencia_orden integer;

create index if not exists productos_tendencia_idx
  on public.productos (tendencia, tendencia_orden)
  where tendencia = true;
